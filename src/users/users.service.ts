import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { FindOneOptions, Not, Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { hashValue } from "src/helpers/hash";
import { UpdateUserDto } from "./dto/update-user.dto";


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) { }

  async signup(createUserDto: CreateUserDto): Promise<User> {
    const { email, username, password } = createUserDto;
    const existingUser = await this.usersRepository.findOne({
      where: [
        { email },
        { username }
      ],
    });

    if (existingUser) {
      throw new BadRequestException('User with this email or username already exists');
    }

    const user = this.usersRepository.create({
      ...createUserDto,
      password: await hashValue(password)
    });

    return this.usersRepository.save(user);
  }

  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    return user;
  }

  findOne(query: FindOneOptions<User>) {
    return this.usersRepository.findOneOrFail(query);
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByQuery(query: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: [
        { email: query },
        { username: query }
      ],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const { email, username, password } = updateUserDto;
    const user = await this.findById(id);

    const existingUser = await this.usersRepository.findOne({
      where: [
        { email, id: Not(id) },
        { username, id: Not(id) }
      ],
    });

    if (existingUser) {
      throw new BadRequestException('User with this email or username already exists');
    }

    if (password) {
      updateUserDto.password = await hashValue(password);
    }

    return this.usersRepository.save({ ...user, ...updateUserDto });
  }
}
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { hashVerify } from "src/helpers/hash";
import { User } from "src/users/entities/user.entity";
import { UsersService } from "src/users/users.service";


@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService
  ) { }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOne({
      select: { username: true, password: true, id: true },
      where: { username }
    })

    if (user && (await hashVerify(password, user.password))) {
      const { password, ...result } = user
      return result
    }

    return null
  }

  async login(user: User) {
    const { username, id: sub } = user

    return {
      access_token: await this.jwtService.signAsync({ username, sub })
    }
  }
}
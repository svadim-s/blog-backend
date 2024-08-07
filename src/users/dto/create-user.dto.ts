import { IsString, IsEmail, IsNotEmpty, Length, IsUrl, IsOptional, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @Length(2, 30)
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @IsUrl()
  @IsOptional()
  avatar: string;

  @Length(2, 200)
  @IsOptional()
  about: string;
}

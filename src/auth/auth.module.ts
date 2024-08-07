import { Module, forwardRef } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UsersModule } from "src/users/users.module";
import { LocalStrategy } from "./strategy/local.strategy";
import { JWTStrategy } from "./strategy/jwt.strategy";
import { AuthService } from "./auth.service";
import { JwtConfigFactory } from "src/config/jwt-config.factory";
import { AuthController } from "./auth.controller";

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule,
    JwtModule.registerAsync({
      useClass: JwtConfigFactory,
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JWTStrategy, JwtConfigFactory],
  exports: [AuthService]
})
export class AuthModule { }
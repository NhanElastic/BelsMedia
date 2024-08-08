import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthEntity } from "./auth.entity";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { UsersModule } from "src/users/users.module";
import { LocalStrategy } from "./strategies/local.strategy";
import { PassportModule } from "@nestjs/passport";
import { UserEntity } from "src/users/user.entity";
import { UserService } from "src/users/user.service";
import { JwtStrategy } from "./strategies/jwt-strategy";
import { RefreshJwtStrategy } from "./strategies/refreshtoken.strategy";

@Module({
    imports: [
        TypeOrmModule.forFeature([AuthEntity, UserEntity]),
        JwtModule.register({
            secret: `${process.env.ACCESS_TOKEN_SECRET_KEY}`,
            signOptions: {expiresIn: '30s'}
        }),
        UsersModule,
        PassportModule,
    ],
    providers: [AuthService, LocalStrategy, UserService, JwtStrategy, RefreshJwtStrategy],
    controllers: [AuthController],
    exports: [AuthService]
})

export class AuthModule {}

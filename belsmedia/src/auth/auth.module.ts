import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./strategies/jwt-strategy";
import { UserEntity } from "src/user/user.entity";
import { UserService } from "src/user/user.service";
import { UsersModule } from "src/user/user.module";
import { JwtModule } from "@nestjs/jwt";

import { AuthEntity } from "./auth.entity";
import { LocalStrategy } from "./strategies/local-strategy";
import { RefreshJwtStrategy } from "./strategies/refreshToken-strategy";

@Module({
    imports: [
        TypeOrmModule.forFeature([AuthEntity, UserEntity]),
            JwtModule.register({
            secret: `${process.env.ACCESS_TOKEN_SECRET_KEY}`,
            signOptions: {expiresIn: '15m'}
        }),
        UsersModule,
        PassportModule, 
    ],
    providers: [AuthService, LocalStrategy, UserService, JwtStrategy, RefreshJwtStrategy],
    controllers: [AuthController],
    exports: [AuthService]
})

export class AuthModule {}

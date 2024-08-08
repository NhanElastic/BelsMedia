import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserEntity } from "../users/user.entity";
import { UserService } from "../users/user.service";
import { SignInDto } from "./DTO/signin.dto";
import { UserDTO } from "src/users/user.dto";
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import { InjectRepository } from "@nestjs/typeorm";
import { AuthEntity } from "./auth.entity";
import { Repository } from "typeorm";


dotenv.config();

@Injectable()
export class AuthService{
    constructor(
        @InjectRepository(AuthEntity) 
        private authRepository: Repository<AuthEntity>,
        private userService: UserService,
        private jwtService: JwtService,
    ) {}

    async validateUser(username: string, password: string): Promise<any>{
        const user = await this.userService.findByUsername(username);
        if(user && await bcrypt.compare(password, user.password)){
            const {password, ...result} = user;
            return result;
        }
        return null

    }

    async login(user: UserEntity){
        const payload = {
            username: user.username,
            sub: user.id,
        };
        return {
            ...user,
            accesstoken: this.jwtService.sign(payload),
            refreshtoken: this.jwtService.sign(payload, {expiresIn: '3d', secret: `${process.env.REFRESH_TOKEN_SECRET_KEY}`}),
        };
    }

    async refreshToken(user: UserEntity){
        const payload = {
            username: user.username,
            sub: user.id,
        };
        return {
            accesstoken: this.jwtService.sign(payload),
        };
    }


    async SignUp(signUpDto: UserDTO): Promise<{message: string}>{
        const usernameExisting = await this.userService.findByUsername(signUpDto.username);
        if(usernameExisting){
            return {message: 'Username already exists'};
        }
        const emailExisting = await this.userService.findByEmail(signUpDto.email);
        if(emailExisting){
            return {message: 'Email already exists'};
        }
        const hashedPassword = await bcrypt.hash(signUpDto.password, 10);
        signUpDto.password = hashedPassword;
        await this.userService.save(signUpDto);
        return {message: 'User created'};
    }



}
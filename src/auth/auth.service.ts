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
        if(user && user.password === password){
            const {password, ...result} = user;
            return result;
        }

    }

    async login(username: string){
        const user = await this.userService.findByUsername(username);
        const payload = {username: user.username, sub: user.id, email: user.email};
        return {
            accesstoken: this.jwtService.sign(payload, {expiresIn: '15m'}),
            refreshtoken: this.jwtService.sign(payload, {expiresIn: '3d'})
        }
    }

    async isRefreshTokenExisting(username: string): Promise<boolean>{
        return await this.authRepository.existsBy({username: username});
        
    }

    async generateRefreshToken(user: UserEntity): Promise<string>{
        const payload = {username: user.username, sub: user.id, email: user.email};
        return this.jwtService.sign(payload, {expiresIn: '3d',secret: process.env['REFRESHTOKEN']});
    }
    async generateAccessToken(user: UserEntity): Promise<string>{
        const payload = {username: user.username, sub: user.id, email: user.email};
        return this.jwtService.sign(payload, {expiresIn: '15m', secret: process.env['ACCESSTOKEN']});
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

    async SignIn(signInDto: SignInDto): Promise<{accesstoken: string}>{
        
            const user = await this.userService.findByUsername(signInDto.username);
            if(user){
                const passwordMatch = await bcrypt.compare(signInDto.password, user.password);
                if(!passwordMatch){
                    throw new UnauthorizedException('Incorrect password');
                }
                const check = await this.isRefreshTokenExisting(user.username);
                if(!check){
                    const refreshToken = await this.generateRefreshToken(user);
                    await this.authRepository.save({username: user.username, refreshtoken: refreshToken});
                }
                // return {accesstoken: refreshToken};
                const accesstoken = await this.generateAccessToken(user);
                return {accesstoken};
            }
            throw new UnauthorizedException('User not found');

    }

}
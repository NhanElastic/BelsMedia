import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AuthEntity } from "./auth.entity";
import { UserDTO } from "src/user/dto/user.dto";
import { UserEntity } from "src/user/user.entity";
import { UserService } from "src/user/user.service";


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
        const userAccessToken = this.jwtService.sign(payload);
        const userRefreshToken = this.jwtService.sign(payload, {expiresIn: '3d', secret: `${process.env.REFRESH_TOKEN_SECRET_KEY}`});
        await this.authRepository.save({username: user.username, refreshToken: userRefreshToken});
        return {
            ...user,
            refreshToken: userRefreshToken,
            accessToken: userAccessToken
        }
    }

    refreshToken(user: UserEntity){
        const payload = {
            username: user.username,
            sub: user.id,
        };
        return this.jwtService.sign(payload);
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
        signUpDto.password = await bcrypt.hash(signUpDto.password, 10);
        await this.userService.save(signUpDto);
        return {message: 'User created'};
    }

    async decodeAccessToken(token: string){
        try{
            return this.jwtService.decode(token);
        }catch(error){
            throw new UnauthorizedException();
        }
    }

}
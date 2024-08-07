import { JwtService } from "@nestjs/jwt";
import { UserEntity } from "../users/user.entity";
import { UserService } from "../users/user.service";
import { SignInDto } from "./DTO/signin.dto";
import { UserDTO } from "src/users/user.dto";
import { AuthEntity } from "./auth.entity";
import { Repository } from "typeorm";
export declare class AuthService {
    private authRepository;
    private userService;
    private jwtService;
    constructor(authRepository: Repository<AuthEntity>, userService: UserService, jwtService: JwtService);
    validateUser(username: string, password: string): Promise<any>;
    isRefreshTokenExisting(username: string): Promise<boolean>;
    generateRefreshToken(user: UserEntity): Promise<string>;
    generateAccessToken(user: UserEntity): Promise<string>;
    SignUp(signUpDto: UserDTO): Promise<{
        message: string;
    }>;
    SignIn(signInDto: SignInDto): Promise<{
        accesstoken: string;
    }>;
}

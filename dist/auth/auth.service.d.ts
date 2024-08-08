import { JwtService } from "@nestjs/jwt";
import { UserEntity } from "../users/user.entity";
import { UserService } from "../users/user.service";
import { UserDTO } from "src/users/user.dto";
import { AuthEntity } from "./auth.entity";
import { Repository } from "typeorm";
export declare class AuthService {
    private authRepository;
    private userService;
    private jwtService;
    constructor(authRepository: Repository<AuthEntity>, userService: UserService, jwtService: JwtService);
    validateUser(username: string, password: string): Promise<any>;
    login(user: UserEntity): Promise<{
        accesstoken: string;
        refreshtoken: string;
        id: number;
        username: string;
        email: string;
        firstName: string;
        lastName: string;
        isActive: boolean;
        password: string;
    }>;
    refreshToken(user: UserEntity): Promise<{
        accesstoken: string;
    }>;
    SignUp(signUpDto: UserDTO): Promise<{
        message: string;
    }>;
}

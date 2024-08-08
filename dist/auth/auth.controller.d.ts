import { AuthService } from "./auth.service";
import { UserDTO } from "src/users/user.dto";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    loginForm(): void;
    login(req: any): Promise<{
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
    getProfile(req: any): any;
    register(signUpDto: UserDTO): Promise<{
        message: string;
    }>;
    refresh(req: any): Promise<{
        accesstoken: string;
    }>;
}

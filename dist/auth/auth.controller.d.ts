import { AuthService } from "./auth.service";
import { UserDTO } from "src/users/user.dto";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    getLogin(): void;
    login(req: any): Promise<{
        message: string;
    }>;
    signUp(signUpDto: UserDTO): Promise<{
        message: string;
    }>;
}

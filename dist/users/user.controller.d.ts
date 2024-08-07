import { UserDTO } from "./user.dto";
import { UserService } from "./user.service";
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getAllUsers(): Promise<UserDTO[]>;
    createUser(user: UserDTO): Promise<any>;
    getUser(id: string): Promise<UserDTO>;
    updateUser(id: string, user: UserDTO): Promise<{
        result: string;
    }>;
    deleteUser(id: string): Promise<{
        result: string;
    }>;
}

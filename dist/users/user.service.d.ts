import { UserEntity } from "./user.entity";
import { Repository } from "typeorm";
import { UserDTO } from "./user.dto";
export type User = any;
export declare class UserService {
    private readonly userRepository;
    constructor(userRepository: Repository<UserEntity>);
    save(userDTO: UserDTO): Promise<UserDTO>;
    getAll(): Promise<UserDTO[]>;
    update(id: string, userDTO: UserDTO): Promise<{
        result: string;
    }>;
    delete(id: string): Promise<{
        result: string;
    }>;
    findOne(id: string): Promise<UserDTO | undefined>;
    findByUsername(username: string): Promise<UserDTO | undefined>;
    findByEmail(email: string): Promise<UserDTO | undefined>;
    findUserRefreshtoken(username: string): Promise<UserDTO | undefined>;
}

import { UserEntity } from "../users/user.entity";
export declare class AuthEntity {
    id: number;
    username: string;
    user: UserEntity;
    refreshtoken: string;
}

import { Expose, Transform } from "class-transformer";


export class UserDTO {
    @Expose()
    id: number;
    firstName: string;
    lastName: string;
    password: string;
    @Expose()
    username: string;

    @Expose()
    email: string;


    @Expose()
    isActive: boolean;

    refreshtoken: string;

}
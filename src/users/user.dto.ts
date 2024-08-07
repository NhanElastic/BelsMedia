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

    @Transform(({obj})=>obj.firstName + ' ' + obj.lastName)
    @Expose()
    fullname

    @Expose()
    isActive: boolean;

    refreshtoken: string;

}
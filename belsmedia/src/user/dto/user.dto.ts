import { Expose, Transform } from "class-transformer";
import {IsEmail, IsOptional} from "class-validator";


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
    status: boolean;

    refreshToken: string;

}

export class updateUserDTO{
    @IsEmail()
    @IsOptional()
    email: string;

    @IsOptional()
    firstName: string;

    @IsOptional()
    lastName: string;

    @IsOptional()
    bio: string

    @IsOptional()
    image: string;
}
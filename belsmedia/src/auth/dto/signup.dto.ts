import { Expose, Transform } from "class-transformer";


export class SignUpDto {
    id: number;
    @Expose()
    username: string;

    password: string;

    @Expose()
    email: string;

    firstName: string;
    lastName: string;
    status: boolean;
    @Transform(({obj})=>obj.firstName + ' ' + obj.lastName)

    @Expose()
    fullname: string;
}
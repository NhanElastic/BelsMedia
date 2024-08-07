import { Body, Controller, Get, Post } from "@nestjs/common";
import { UserDTO } from "./user.dto";
import { UserService } from "./user.service";

@Controller('users')

export class UserController{
    constructor(private readonly userService: UserService) {

    }

        @Get()
    async getAllUsers(): Promise<UserDTO[]>{
        return await this.userService.getAll();
    }

    @Post()
    async createUser(@Body() user: UserDTO): Promise<any>
    {   
        const currsuser = this.userService.save(user);
        return {"message": (await currsuser).username};
    }

    @Get('/user/:id')
    async getUser(@Body() id: string): Promise<UserDTO>{
        return await this.userService.findOne(id);
    }

    @Post('/update/:id')
    async updateUser(@Body() id: string, user: UserDTO): Promise<{result: string}>{
        return await this.userService.update(id, user);
    }

    @Post('/delete/:id')
    async deleteUser(@Body() id: string): Promise<{result: string}>{
        return await this.userService.delete(id);
    }


}
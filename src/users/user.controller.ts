import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { UserDTO } from "./user.dto";
import { UserService } from "./user.service";
import { JwtGuard } from "src/auth/guard/jwt-auth.guard";

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

    // @UseGuards(JwtGuard)
    @Get('id/:id')
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

    @UseGuards(JwtGuard)
    @Get(':username')
    async getUserByUsername(@Param('username') username: string): Promise<UserDTO>{
        return await this.userService.findByUsername(username);
    }
}
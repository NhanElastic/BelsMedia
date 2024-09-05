import {Controller, Get, NotFoundException, Param, Request, UseGuards} from '@nestjs/common';
import {UserService} from './user.service';
import {UserDTO} from "./dto/user.dto";
import {JwtGuard} from "../auth/guards/jwt-auth.guard";

@Controller('/profiles')
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @Get('/:username')
    findProfile(@Param('username') username: string): Promise<UserDTO|undefined> {
        const user = this.userService.findByUsername(username);
        if(!user){
            throw new NotFoundException()
        }
        return this.userService.convertToJSON(user);
    }

    @UseGuards(JwtGuard)
    @Get('')
    getCurrentUser(@Request() req: any): Promise<UserDTO|undefined>{
        const user = this.userService.findByUsername(req.user.username);
        if(!user){
            throw new NotFoundException()
        }
        return this.userService.convertToJSON(user);
    }




}

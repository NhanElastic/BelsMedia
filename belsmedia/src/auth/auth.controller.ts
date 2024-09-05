import { Body, Controller, Post, UseGuards, Request } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserDTO } from "src/user/dto/user.dto";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { RefreshJwtGuard } from "./guards/refresh-jwt-auth.guard";
import {UserService} from "../user/user.service";

@Controller('/auth')

export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {}


    // @Get('login')
    // @Render('auth/login')
    // loginForm(){
    // }


    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req: any){
        return await this.authService.login(req.user);
    }


    @Post('register')
    register(@Body() signUpDto: UserDTO): Promise<{message:string}>{
        const user = this.authService.SignUp(signUpDto);
        
    }

    @UseGuards(RefreshJwtGuard)
    @Post('refresh')
    async refresh(@Request() req: any): Promise<{accessToken: string}>{
        const accessToken = this.authService.refreshToken(req.user);
        return {accessToken: accessToken};
    }

}
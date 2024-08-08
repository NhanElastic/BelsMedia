import { Body, Controller, Get, Post, Render, UseGuards, Request } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserDTO } from "src/users/user.dto";
import { LocalAuthGuard } from "./guard/local-auth.guard";
import { RefreshJwtGuard } from "./guard/refresh-jwt-auth.guard";

@Controller()

export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}


    @Get('login')
    @Render('auth/login/login.hbs')
    loginForm(){
    }


    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req){
        return this.authService.login(req.user);
    }

    @Get('profile')
    getProfile(@Request() req){
        return req.user;
    }

    @Post('register')
    register(@Body() signUpDto: UserDTO): Promise<{message:string}>{
        return this.authService.SignUp(signUpDto);
    }

    @UseGuards(RefreshJwtGuard)
    @Post('refresh')
    async refresh(@Request() req){
        return this.authService.refreshToken(req.user);
    }

}
import { Body, Controller, Get, Post, Render, UseGuards, Request } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignInDto } from "./DTO/signin.dto";
import { UserDTO } from "src/users/user.dto";
import { AuthGuard } from "@nestjs/passport";
import { LocalAuthGuard } from "./local-auth.guard";

@Controller()

export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Get('/login')
    @Render('auth/login')
    getLogin() {
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req): Promise<{message:string}>{
        return req.user;
    }


    @Post('signup')
    signUp(@Body() signUpDto: UserDTO): Promise<{message:string}>{
        return this.authService.SignUp(signUpDto);
    }

}
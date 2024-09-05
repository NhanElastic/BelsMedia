import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth/auth.service';

@Controller('api')
export class AppController {
  constructor(private readonly authService: AuthService) {}


}

import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('auth/login/login.hbs')
  getHello(): { message: string } {
    return this.appService.getHello();
  }
}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourcesOptions } from 'db/data.source';
import { UsersModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { UserController } from './user/user.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourcesOptions),
    UsersModule,
    AuthModule
  ],
  controllers: [AppController, AuthController, UserController],
  providers: [AppService],
})
export class AppModule {}

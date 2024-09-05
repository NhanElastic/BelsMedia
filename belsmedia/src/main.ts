import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    origin: "http://localhost:5500",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true
  }); 
  
  await app.listen(8000);
}
bootstrap();

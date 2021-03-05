import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = {
    origin: true,
    credentials: true,
    methods: 'GET,HEAD,PATCH,POST,DELETE,OPTIONS',
  };
  app.enableCors(options);
  app.use(cookieParser());
  await app.listen(4000);
}
bootstrap();

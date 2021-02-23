import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = {
    origin: true,
    credentials: true,
    methods: 'GET,HEAD,PATCH,POST,DELETE,OPTIONS',
  };
  app.enableCors(options);
  await app.listen(3000);
}
bootstrap();

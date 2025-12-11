import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const whiteList = [
    'http://localhost:4200',
    'http://127.0.0.1:4200',
    'https://frontend-proud-moon-5284.fly.dev/',
  ];

  app.enableCors({
    origin: whiteList,
    methods: 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

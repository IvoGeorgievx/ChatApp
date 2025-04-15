import { NestFactory } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  });
  app.useGlobalPipes(new ZodValidationPipe());
  await app.listen(process.env.PORT ?? 3005);
}
bootstrap();

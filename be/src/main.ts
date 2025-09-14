import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { SanitizePipe } from './global/sanitizer.pipe';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  
  // set global prefix
  app.setGlobalPrefix('api', {
    exclude: [{ path: '', method: RequestMethod.OPTIONS }],
  });
  app.enableCors({
    origin: process.env.FE_URL as string, // FE domain
    credentials: true,                    // allow cookies
    methods: ['HEAD', 'GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  app.useGlobalPipes(new SanitizePipe());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

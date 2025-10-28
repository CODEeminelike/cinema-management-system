import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { APP_CONSTANTS } from 'shared/constant/app.constant';
import { LoggingInterceptor } from 'shared/interceptors/logging.interceptor';
import { ConfigService } from '@nestjs/config';

import { ResponseInterceptor } from './shared/interceptors/response.interceptor';
import { CustomValidationPipe } from 'shared/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalPipes(new CustomValidationPipe());

  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix(APP_CONSTANTS.API_PREFIX || 'api');

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalInterceptors(new LoggingInterceptor(app.get(ConfigService)));
  await app.listen(APP_CONSTANTS.PORT);
  console.log(
    `Application is running on: http://localhost:${APP_CONSTANTS.PORT}`,
  );
}
bootstrap();

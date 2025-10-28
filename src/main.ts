import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { APP_CONSTANTS } from 'shared/constant/app.constant';
import { LoggingInterceptor } from 'shared/interceptors/logging.interceptor';
import { ConfigService } from '@nestjs/config';
import { ResponseInterceptor } from './shared/interceptors/response.interceptor';
import { CustomValidationPipe } from 'shared/pipes/validation.pipe';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global pipes
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalPipes(new CustomValidationPipe());

  // Global filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global prefix
  app.setGlobalPrefix(APP_CONSTANTS.API_PREFIX || 'api');

  // Global interceptors
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalInterceptors(new LoggingInterceptor(app.get(ConfigService)));

  // //  Swagger configuration
  // const config = new DocumentBuilder()
  //   .setTitle('Movie API')
  //   .setDescription('API documentation for Movie application')
  //   .setVersion('1.0')
  //   .addBearerAuth() // Thêm nếu dùng JWT
  //   .build();

  // const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api', app, document);

  await app.listen(APP_CONSTANTS.PORT);
  console.log(
    `Application is running on: http://localhost:${APP_CONSTANTS.PORT}`,
  );
  console.log(
    `Swagger documentation: http://localhost:${APP_CONSTANTS.PORT}/api`,
  );
}
bootstrap();

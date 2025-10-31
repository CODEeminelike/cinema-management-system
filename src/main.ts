import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './shared/filters/http-exception.filter';
import { APP_CONSTANTS } from './shared/constant/app.constant';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';
import { ConfigService } from '@nestjs/config';
import { ResponseInterceptor } from './shared/interceptors/response.interceptor';
import { CustomValidationPipe } from './shared/pipes/validation.pipe';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global pipes
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalPipes(new CustomValidationPipe());

  // Global filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global prefix - QUAN TRỌNG: chỉ dùng '/' trên Vercel
  app.setGlobalPrefix(
    process.env.NODE_ENV === 'production'
      ? ''
      : APP_CONSTANTS.API_PREFIX || 'api',
  );

  // Global interceptors
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalInterceptors(new LoggingInterceptor(app.get(ConfigService)));

  // CORS for production
  app.enableCors({
    origin: true, // Cho phép tất cả trên production
    credentials: true,
  });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Movie API')
    .setDescription('API documentation for Movie application')
    .setVersion('2.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Swagger path - Sử dụng 'docs' cho production để tránh xung đột với các route API
  const swaggerPath = process.env.NODE_ENV === 'production' ? 'docs' : 'api';

  SwaggerModule.setup(swaggerPath, app, document, {
    customSiteTitle: 'Movie API Documentation',
    swaggerOptions: {
      persistAuthorization: true,
    },
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css',
    ],
  });

  // Dynamic port for Vercel
  const port = process.env.PORT || APP_CONSTANTS.PORT || 3333;

  await app.listen(port);

  console.log(`Application is running on port: ${port}`);
  console.log(`Swagger documentation: /${swaggerPath}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
}

bootstrap();

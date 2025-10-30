"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const http_exception_filter_1 = require("./shared/filters/http-exception.filter");
const app_constant_1 = require("./shared/constant/app.constant");
const logging_interceptor_1 = require("./shared/interceptors/logging.interceptor");
const config_1 = require("@nestjs/config");
const response_interceptor_1 = require("./shared/interceptors/response.interceptor");
const validation_pipe_1 = require("./shared/pipes/validation.pipe");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    // Global pipes
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalPipes(new validation_pipe_1.CustomValidationPipe());
    // Global filters
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    // Global prefix
    app.setGlobalPrefix(app_constant_1.APP_CONSTANTS.API_PREFIX || 'api');
    // Global interceptors
    app.useGlobalInterceptors(new response_interceptor_1.ResponseInterceptor());
    app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor(app.get(config_1.ConfigService)));
    // CORS for production
    app.enableCors({
        origin: [
            'https://cinema-management-system-sigma.vercel.app/', // Thay bằng domain thực tế
            'http://localhost:3000',
            'http://localhost:5173', // Vite dev server
            process.env.FRONTEND_URL, // Dynamic frontend URL
        ].filter(Boolean),
        credentials: true,
    });
    // Swagger configuration
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Movie API')
        .setDescription('API documentation for Movie application')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document, {
        customSiteTitle: 'Movie API Documentation',
        swaggerOptions: {
            persistAuthorization: true,
        },
    });
    // Dynamic port for Vercel
    const port = process.env.PORT || app_constant_1.APP_CONSTANTS.PORT || 3333;
    await app.listen(port);
    // Only log in development
    if (process.env.NODE_ENV !== 'production') {
        console.log(`Application is running on: http://localhost:${port}`);
        console.log(`Swagger documentation: http://localhost:${port}/api`);
    }
    else {
        console.log(`Application is running on port: ${port}`);
        console.log(`Swagger available at: /api`);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map
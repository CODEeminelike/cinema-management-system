// src/shared/filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;
    const message = exception.message || 'Internal server error';

    response.status(status).json({
      statusCode: status,
      message: status === 401 ? 'Unauthorized' : 'Error',
      content: message,
      dateTime: new Date().toISOString(),
      messageConstants: null,
    });
  }
}

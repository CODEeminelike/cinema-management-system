import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { statusMessages, statusCodes } from './status-code.helper';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : statusCodes.INTERNAL_SERVER_ERROR;

    // Lấy message từ statusMessages, nếu không có thì dùng message mặc định
    const defaultMessage = statusMessages[status] || 'Unknown Error';
    const exceptionResponse = exception.getResponse?.();

    // Xử lý đặc biệt cho validation errors (400)
    if (status === statusCodes.BAD_REQUEST) {
      this.handleValidationError(response, status, exceptionResponse);
      return;
    }

    // Xử lý tất cả các case khác
    this.handleOtherErrors(
      response,
      status,
      defaultMessage,
      exception,
      exceptionResponse,
    );
  }

  private handleValidationError(
    response: Response,
    status: number,
    exceptionResponse: any,
  ) {
    if (
      typeof exceptionResponse === 'object' &&
      Array.isArray(exceptionResponse['message'])
    ) {
      // Trường hợp lỗi validation từ CustomValidationPipe
      response.status(status).json({
        statusCode: status,
        message: 'Dữ liệu đầu vào không hợp lệ',
        content: exceptionResponse['message'],
        dateTime: new Date().toISOString(),
        messageConstants: null,
      });
    } else {
      // Trường hợp lỗi 400 khác
      const content = this.extractContent(exceptionResponse);
      response.status(status).json({
        statusCode: status,
        message: statusMessages[status],
        content: content,
        dateTime: new Date().toISOString(),
        messageConstants: null,
      });
    }
  }

  private handleOtherErrors(
    response: Response,
    status: number,
    defaultMessage: string,
    exception: any,
    exceptionResponse: any,
  ) {
    const content = this.extractContent(exceptionResponse) || exception.message;

    response.status(status).json({
      statusCode: status,
      message: defaultMessage,
      content: content,
      dateTime: new Date().toISOString(),
      messageConstants: null,
    });
  }

  private extractContent(exceptionResponse: any): string | string[] {
    if (!exceptionResponse) return '';

    if (typeof exceptionResponse === 'string') {
      return exceptionResponse;
    }

    if (typeof exceptionResponse === 'object') {
      // NestJS thường trả về { message: string | string[], error: string }
      if (Array.isArray(exceptionResponse['message'])) {
        return exceptionResponse['message'];
      }
      return (
        exceptionResponse['message'] ||
        exceptionResponse['error'] ||
        JSON.stringify(exceptionResponse)
      );
    }

    return String(exceptionResponse);
  }
}

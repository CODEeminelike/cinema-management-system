import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private configService: ConfigService) {}
  private logger = new Logger('API');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (this.configService.get('NODE_ENV') === 'production') {
      return next.handle(); // Bỏ qua log trong production
    }
    const now = Date.now();
    const { method, url } = context.switchToHttp().getRequest<Request>();
    return next.handle().pipe(
      finalize(() => {
        const { method, url } = context.switchToHttp().getRequest<Request>();
        const response = context.switchToHttp().getResponse();
        const user = context.switchToHttp().getRequest().user || 'Anonymous';
        this.logger.log(
          `${method} ${url} ${response.statusCode} ${Date.now() - now}ms [User: ${user?.userId || user}]`,
        );
      }),
    );
  }
}

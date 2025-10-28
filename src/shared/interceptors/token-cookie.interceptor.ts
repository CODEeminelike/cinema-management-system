// src/shared/interceptors/token-cookie.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';

@Injectable()
export class TokenCookieInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((body) => {
        let refreshToken: string | undefined;

        // Extract refreshToken từ body
        if (body && body.data && body.data.refreshToken) {
          refreshToken = body.data.refreshToken;
          delete body.data.refreshToken;
        } else if (body && body.refreshToken) {
          refreshToken = body.refreshToken;
          delete body.refreshToken;
        }

        // Set cookie nếu có refreshToken
        if (refreshToken) {
          console.log('Đã thêm refreshToken vào cookie');
          response.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/',
          });
        }

        return body;
      }),
    );
  }
}

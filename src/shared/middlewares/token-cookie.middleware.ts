// src/shared/middlewares/token-cookie.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TokenCookieMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const originalJson = res.json;
    console.log(originalJson);
    res.json = function (body: any) {
      // Kiểm tra nếu body chứa refreshToken (trong data hoặc trực tiếp)
      let refreshToken: string | undefined;
      if (body && body.data && body.data.refreshToken) {
        refreshToken = body.data.refreshToken;
        delete body.data.refreshToken; // Tách khỏi JSON
      } else if (body && body.refreshToken) {
        refreshToken = body.refreshToken;
        delete body.refreshToken; // Tách khỏi JSON (cho trường hợp refresh)
      }

      if (refreshToken) {
        console.log('ĐAY nè');
        // Thêm vào cookie
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
          path: '/',
        });
      }
      console.log('chạy qua middler');
      return originalJson.call(this, body);
    };

    next();
  }
}

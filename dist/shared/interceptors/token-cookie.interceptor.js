"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenCookieInterceptor = void 0;
// src/shared/interceptors/token-cookie.interceptor.ts
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let TokenCookieInterceptor = class TokenCookieInterceptor {
    intercept(context, next) {
        const response = context.switchToHttp().getResponse();
        return next.handle().pipe((0, operators_1.map)((body) => {
            let refreshToken;
            // Extract refreshToken từ body
            if (body && body.data && body.data.refreshToken) {
                refreshToken = body.data.refreshToken;
                delete body.data.refreshToken;
            }
            else if (body && body.refreshToken) {
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
        }));
    }
};
exports.TokenCookieInterceptor = TokenCookieInterceptor;
exports.TokenCookieInterceptor = TokenCookieInterceptor = __decorate([
    (0, common_1.Injectable)()
], TokenCookieInterceptor);
//# sourceMappingURL=token-cookie.interceptor.js.map
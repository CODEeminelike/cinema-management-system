"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenCookieMiddleware = void 0;
// src/shared/middlewares/token-cookie.middleware.ts
const common_1 = require("@nestjs/common");
let TokenCookieMiddleware = class TokenCookieMiddleware {
    use(req, res, next) {
        const originalJson = res.json;
        console.log(originalJson);
        res.json = function (body) {
            // Kiểm tra nếu body chứa refreshToken (trong data hoặc trực tiếp)
            let refreshToken;
            if (body && body.data && body.data.refreshToken) {
                refreshToken = body.data.refreshToken;
                delete body.data.refreshToken; // Tách khỏi JSON
            }
            else if (body && body.refreshToken) {
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
};
exports.TokenCookieMiddleware = TokenCookieMiddleware;
exports.TokenCookieMiddleware = TokenCookieMiddleware = __decorate([
    (0, common_1.Injectable)()
], TokenCookieMiddleware);
//# sourceMappingURL=token-cookie.middleware.js.map
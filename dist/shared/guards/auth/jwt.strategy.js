"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var JwtStrategy_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../../../sys/prisma/prisma.service");
const common_2 = require("@nestjs/common");
let JwtStrategy = JwtStrategy_1 = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    configService;
    prisma;
    logger = new common_2.Logger(JwtStrategy_1.name);
    constructor(configService, prisma) {
        // Lấy JWT_SECRET và kiểm tra
        const jwtSecret = configService.get('JWT_SECRET');
        if (!jwtSecret) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(), // Lấy token từ header Authorization: Bearer <token>
            ignoreExpiration: false, // Từ chối token nếu đã hết hạn
            secretOrKey: jwtSecret, // Đảm bảo secretOrKey là string
        });
        this.configService = configService;
        this.prisma = prisma;
    }
    async validate(payload) {
        this.logger.log(`Validating JWT for userId: ${payload.userId}`);
        // Kiểm tra payload
        if (!payload.userId) {
            this.logger.warn('Invalid JWT payload: userId missing');
            throw new common_1.UnauthorizedException('Token không hợp lệ');
        }
        // Kiểm tra user trong cơ sở dữ liệu
        const user = await this.prisma.nguoiDung.findUnique({
            where: { tai_khoan: payload.userId },
            select: {
                tai_khoan: true,
                email: true,
                loai_nguoi_dung: true, // Lấy thêm vai trò để hỗ trợ RBAC nếu cần
            },
        });
        if (!user) {
            this.logger.warn(`User not found for userId: ${payload.userId}`);
            throw new common_1.UnauthorizedException('Người dùng không tồn tại');
        }
        this.logger.log(`User authenticated: ${user.email}`);
        return {
            userId: user.tai_khoan,
            email: user.email,
            role: user.loai_nguoi_dung, // Trả về role để sử dụng trong RolesGuard
        };
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = JwtStrategy_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map
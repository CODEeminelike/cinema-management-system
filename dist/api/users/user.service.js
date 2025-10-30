"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../sys/prisma/prisma.service");
const token_service_1 = require("../../sys/token/token.service");
const bcrypt = __importStar(require("bcrypt"));
const crypto = __importStar(require("crypto"));
let UsersService = class UsersService {
    prisma;
    tokenService;
    constructor(prisma, tokenService) {
        this.prisma = prisma;
        this.tokenService = tokenService;
    }
    async register(createUserDto) {
        const { ho_ten, email, so_dt, mat_khau } = createUserDto;
        const existingUser = await this.prisma.nguoiDung.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email đã được sử dụng');
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(mat_khau, saltRounds);
        try {
            const user = await this.prisma.nguoiDung.create({
                data: {
                    ho_ten,
                    email,
                    so_dt,
                    mat_khau: hashedPassword,
                    loai_nguoi_dung: 'USER',
                },
            });
            return await this.generateTokens(user);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Đã có lỗi xảy ra khi đăng ký');
        }
    }
    async login(loginDto) {
        const { email, mat_khau } = loginDto;
        const user = await this.prisma.nguoiDung.findUnique({
            where: { email },
            select: {
                tai_khoan: true,
                ho_ten: true,
                email: true,
                so_dt: true,
                loai_nguoi_dung: true,
                mat_khau: true,
            },
        });
        if (!user || !(await bcrypt.compare(mat_khau, user.mat_khau))) {
            throw new common_1.UnauthorizedException('Email hoặc mật khẩu không đúng');
        }
        return await this.generateTokens(user);
    }
    async refresh(refreshToken) {
        let payload;
        try {
            // Xác thực refresh token bằng JWT
            payload = this.tokenService.verifyRefreshToken(refreshToken);
            // Băm refresh token để kiểm tra trong cơ sở dữ liệu
            const hashedToken = crypto
                .createHash('sha256')
                .update(refreshToken)
                .digest('hex');
            // Kiểm tra refresh token trong cơ sở dữ liệu
            const storedToken = await this.prisma.refreshToken.findUnique({
                where: { hashedToken },
            });
            if (!storedToken) {
                throw new common_1.UnauthorizedException('Refresh token không hợp lệ');
            }
            if (!storedToken ||
                storedToken.expiresAt < new Date() ||
                storedToken.deletedAt) {
                throw new common_1.UnauthorizedException('Refresh token không hợp lệ hoặc đã hết hạn');
            }
            // Kiểm tra user
            const user = await this.prisma.nguoiDung.findUnique({
                where: { tai_khoan: payload.userId },
            });
            if (!user) {
                throw new common_1.UnauthorizedException('User không tồn tại');
            }
            // Xóa refresh token cũ
            await this.prisma.refreshToken.delete({
                where: { hashedToken },
            });
            // Tạo token mới
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = this.tokenService.createTokens(user.tai_khoan);
            // Lưu refresh token mới vào cơ sở dữ liệu
            const expiresIn = '7d'; // Giá trị mặc định từ TokenService
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7); // Tính thời gian hết hạn (7 ngày)
            const newHashedToken = crypto
                .createHash('sha256')
                .update(newRefreshToken)
                .digest('hex');
            await this.prisma.refreshToken.create({
                data: {
                    userId: user.tai_khoan,
                    hashedToken: newHashedToken,
                    expiresAt,
                },
            });
            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Refresh token không hợp lệ hoặc đã hết hạn');
        }
    }
    async generateTokens(user) {
        // Tạo token mới
        const { accessToken, refreshToken } = this.tokenService.createTokens(user.tai_khoan);
        // Mã hóa refresh token
        const hashedToken = crypto
            .createHash('sha256')
            .update(refreshToken)
            .digest('hex');
        // Tính thời gian hết hạn (7 ngày)
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        // Tìm refresh token hiện tại của người dùng
        const existingToken = await this.prisma.refreshToken.findFirst({
            where: { userId: user.tai_khoan },
        });
        if (existingToken) {
            // Cập nhật refresh token hiện có
            await this.prisma.refreshToken.update({
                where: { id: existingToken.id }, // Sử dụng id làm trường duy nhất
                data: {
                    hashedToken,
                    expiresAt,
                    deletedAt: null,
                },
            });
        }
        else {
            // Tạo mới refresh token
            await this.prisma.refreshToken.create({
                data: {
                    userId: user.tai_khoan,
                    hashedToken,
                    expiresAt,
                },
            });
        }
        const userResponse = {
            tai_khoan: user.tai_khoan,
            ho_ten: user.ho_ten,
            email: user.email,
            so_dt: user.so_dt,
            loai_nguoi_dung: user.loai_nguoi_dung,
        };
        return {
            message: 'Đăng nhập thành công',
            data: {
                user: userResponse,
                accessToken,
                refreshToken,
            },
        };
    }
    async logout(refreshToken) {
        try {
            // Xác thực refresh token bằng JWT
            const payload = this.tokenService.verifyRefreshToken(refreshToken);
            // Băm refresh token để kiểm tra trong cơ sở dữ liệu
            const hashedToken = crypto
                .createHash('sha256')
                .update(refreshToken)
                .digest('hex');
            // Kiểm tra refresh token trong cơ sở dữ liệu
            const storedToken = await this.prisma.refreshToken.findUnique({
                where: { hashedToken },
            });
            if (!storedToken) {
                throw new common_1.UnauthorizedException('Refresh token không hợp lệ');
            }
            if (storedToken.expiresAt < new Date() || storedToken.deletedAt) {
                throw new common_1.UnauthorizedException('Refresh token không hợp lệ hoặc đã hết hạn');
            }
            // Kiểm tra userId trong payload có khớp với userId trong cơ sở dữ liệu
            if (storedToken.userId !== payload.userId) {
                throw new common_1.UnauthorizedException('Refresh token không hợp lệ');
            }
            // Đánh dấu refresh token là không hợp lệ bằng cách cập nhật deletedAt
            await this.prisma.refreshToken.update({
                where: { hashedToken },
                data: { deletedAt: new Date() },
            });
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Refresh token không hợp lệ hoặc đã hết hạn');
        }
    }
    async getProfile(userId) {
        if (!userId || isNaN(userId)) {
            throw new common_1.BadRequestException('UserId phải là số nguyên hợp lệ.');
        }
        const user = await this.prisma.nguoiDung.findUnique({
            where: { tai_khoan: userId },
            select: {
                tai_khoan: true,
                ho_ten: true,
                email: true,
                so_dt: true,
                loai_nguoi_dung: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('Không tìm thấy người dùng với userId cung cấp.');
        }
        // Trả về UserResponse với các trường không nhạy cảm
        return {
            tai_khoan: user.tai_khoan,
            ho_ten: user.ho_ten,
            email: user.email,
            so_dt: user.so_dt,
            loai_nguoi_dung: user.loai_nguoi_dung,
        };
    }
    async updateProfile(updateUserDto, userId) {
        // Tìm người dùng hiện tại
        const existingUser = await this.prisma.nguoiDung.findUnique({
            where: { tai_khoan: userId },
            select: {
                tai_khoan: true,
                ho_ten: true,
                email: true,
                so_dt: true,
                loai_nguoi_dung: true,
            },
        });
        if (!existingUser) {
            throw new common_1.NotFoundException('Không tìm thấy người dùng');
        }
        // Kiểm tra xung đột email nếu được cập nhật
        if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
            const emailConflict = await this.prisma.nguoiDung.findUnique({
                where: { email: updateUserDto.email },
            });
            if (emailConflict) {
                throw new common_1.ConflictException('Email đã được sử dụng');
            }
        }
        // Cập nhật dữ liệu (partial update)
        const updatedUser = await this.prisma.nguoiDung.update({
            where: { tai_khoan: userId },
            data: {
                ho_ten: updateUserDto.ho_ten ?? existingUser.ho_ten,
                email: updateUserDto.email ?? existingUser.email,
                so_dt: updateUserDto.so_dt ?? existingUser.so_dt,
                // Không cập nhật loai_nguoi_dung hoặc mat_khau ở đây
            },
            select: {
                tai_khoan: true,
                ho_ten: true,
                email: true,
                so_dt: true,
                loai_nguoi_dung: true,
            },
        });
        return {
            tai_khoan: updatedUser.tai_khoan,
            ho_ten: updatedUser.ho_ten,
            email: updatedUser.email,
            so_dt: updatedUser.so_dt,
            loai_nguoi_dung: updatedUser.loai_nguoi_dung,
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        token_service_1.TokenService])
], UsersService);
//# sourceMappingURL=user.service.js.map
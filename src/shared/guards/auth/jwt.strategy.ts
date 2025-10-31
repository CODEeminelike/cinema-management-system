import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../sys/prisma/prisma.service';
import { Logger } from '@nestjs/common';

interface JwtPayload {
  userId: number;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    // Lấy JWT_SECRET và kiểm tra
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('Biến môi trường JWT_SECRET chưa được định nghĩa');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Lấy token từ header Authorization: Bearer <token>
      ignoreExpiration: false, // Từ chối token nếu đã hết hạn
      secretOrKey: jwtSecret, // Đảm bảo secretOrKey là string
    });
  }

  async validate(payload: JwtPayload): Promise<any> {
    this.logger.log(`Validating JWT for userId: ${payload.userId}`);

    // Kiểm tra payload
    if (!payload.userId) {
      this.logger.warn('Invalid JWT payload: userId missing');
      throw new UnauthorizedException('Token không hợp lệ');
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
      throw new UnauthorizedException('Người dùng không tồn tại');
    }

    this.logger.log(`User authenticated: ${user.email}`);
    return {
      userId: user.tai_khoan,
      email: user.email,
      role: user.loai_nguoi_dung, // Trả về role để sử dụng trong RolesGuard
    };
  }
}

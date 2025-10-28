// src/admin/users/user.service.ts
import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../sys/prisma/prisma.service';
import { TokenService } from '../../sys/token/token.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Logger } from '@nestjs/common';

interface UserResponse {
  tai_khoan: number;
  ho_ten: string;
  email: string;
  so_dt: string | null;
  loai_nguoi_dung: string;
}

interface CreateResponse {
  message: string;
  data: {
    user: UserResponse;
    accessToken: string;
    refreshToken: string;
  };
}

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private prisma: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  async addAccount(createAdminDto: CreateAdminDto): Promise<CreateResponse> {
    const {
      ho_ten,
      email,
      so_dt,
      mat_khau,
      loai_nguoi_dung = 'ADMIN',
    } = createAdminDto;

    // Kiểm tra email đã tồn tại
    const existingUser = await this.prisma.nguoiDung.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email đã tồn tại');
    }

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(mat_khau, 10);

    try {
      // Tạo tài khoản mới
      const newUser = await this.prisma.nguoiDung.create({
        data: {
          ho_ten,
          email,
          so_dt,
          mat_khau: hashedPassword,
          loai_nguoi_dung,
        },
      });

      // Note lại (log) tài khoản mới
      this.logger.log(
        `Tài khoản ${loai_nguoi_dung} mới được tạo: ${newUser.email} (ID: ${newUser.tai_khoan})`,
      );

      // Generate tokens và lưu refresh token
      return await this.generateTokens(newUser);
    } catch (error) {
      throw new InternalServerErrorException(
        'Đã có lỗi xảy ra khi tạo tài khoản',
      );
    }
  }

  private async generateTokens(user: any): Promise<CreateResponse> {
    // Tạo token mới
    const { accessToken, refreshToken } = this.tokenService.createTokens(
      user.tai_khoan,
    );

    // Mã hóa refresh token
    const hashedToken = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    // Tính thời gian hết hạn (7 ngày, tương tự mẫu)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Tìm refresh token hiện tại của người dùng (nếu có)
    const existingToken = await this.prisma.refreshToken.findFirst({
      where: { userId: user.tai_khoan },
    });

    if (existingToken) {
      // Cập nhật refresh token hiện có
      await this.prisma.refreshToken.update({
        where: { id: existingToken.id },
        data: {
          hashedToken,
          expiresAt,
          deletedAt: null,
        },
      });
    } else {
      // Tạo mới refresh token
      await this.prisma.refreshToken.create({
        data: {
          userId: user.tai_khoan,
          hashedToken,
          expiresAt,
        },
      });
    }

    const userResponse: UserResponse = {
      tai_khoan: user.tai_khoan,
      ho_ten: user.ho_ten,
      email: user.email,
      so_dt: user.so_dt,
      loai_nguoi_dung: user.loai_nguoi_dung,
    };

    return {
      message: `Tài khoản ${user.loai_nguoi_dung} được tạo thành công`,
      data: {
        user: userResponse,
        accessToken,
        refreshToken,
      },
    };
  }
}

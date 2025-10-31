import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../sys/prisma/prisma.service';
import { TokenService } from '../../sys/token/token.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UpdateUserDto } from './dto/update-user.dto';

interface UserResponse {
  tai_khoan: number;
  ho_ten: string;
  email: string;
  so_dt: string | null;
  loai_nguoi_dung: string;
}

interface LoginResponse {
  message: string;
  data: {
    user: UserResponse;
    accessToken: string;
    refreshToken: string;
  };
}

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<LoginResponse> {
    const { ho_ten, email, so_dt, mat_khau } = createUserDto;

    const existingUser = await this.prisma.nguoiDung.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email đã được sử dụng');
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
    } catch (error) {
      throw new InternalServerErrorException('Đã có lỗi xảy ra khi đăng ký');
    }
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
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
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    return await this.generateTokens(user);
  }

  async refresh(refreshToken: string): Promise<RefreshResponse> {
    let payload: any;
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
        throw new UnauthorizedException('Refresh token không hợp lệ');
      }
      if (
        !storedToken ||
        storedToken.expiresAt < new Date() ||
        storedToken.deletedAt
      ) {
        throw new UnauthorizedException(
          'Refresh token không hợp lệ hoặc đã hết hạn',
        );
      }

      // Kiểm tra user
      const user = await this.prisma.nguoiDung.findUnique({
        where: { tai_khoan: payload.userId },
      });
      if (!user) {
        throw new UnauthorizedException('User không tồn tại');
      }

      // Xóa refresh token cũ
      await this.prisma.refreshToken.delete({
        where: { hashedToken },
      });

      // Tạo token mới
      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        this.tokenService.createTokens(user.tai_khoan);

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
    } catch (error: any) {
      throw new UnauthorizedException(
        'Refresh token không hợp lệ hoặc đã hết hạn',
      );
    }
  }

  private async generateTokens(user: any): Promise<LoginResponse> {
    // Tạo token mới
    const { accessToken, refreshToken } = this.tokenService.createTokens(
      user.tai_khoan,
    );

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
      message: 'Xác thực thành công',
      data: {
        user: userResponse,
        accessToken,
        refreshToken,
      },
    };
  }

  async logout(refreshToken: string): Promise<void> {
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
        throw new UnauthorizedException('Refresh token không hợp lệ');
      }

      if (storedToken.expiresAt < new Date() || storedToken.deletedAt) {
        throw new UnauthorizedException(
          'Refresh token không hợp lệ hoặc đã hết hạn',
        );
      }

      // Kiểm tra userId trong payload có khớp với userId trong cơ sở dữ liệu
      if (storedToken.userId !== payload.userId) {
        throw new UnauthorizedException('Refresh token không hợp lệ');
      }

      // Đánh dấu refresh token là không hợp lệ bằng cách cập nhật deletedAt
      await this.prisma.refreshToken.update({
        where: { hashedToken },
        data: { deletedAt: new Date() },
      });
    } catch (error: any) {
      throw new UnauthorizedException(
        'Refresh token không hợp lệ hoặc đã hết hạn',
      );
    }
  }

  async getProfile(userId: number): Promise<UserResponse> {
    if (!userId || isNaN(userId)) {
      throw new BadRequestException('UserId phải là số nguyên hợp lệ.');
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
      throw new NotFoundException(
        'Không tìm thấy người dùng với userId cung cấp.',
      );
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

  async updateProfile(
    updateUserDto: UpdateUserDto,
    userId: number,
  ): Promise<UserResponse> {
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
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    // Kiểm tra xung đột email nếu được cập nhật
    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const emailConflict = await this.prisma.nguoiDung.findUnique({
        where: { email: updateUserDto.email },
      });
      if (emailConflict) {
        throw new ConflictException('Email đã được sử dụng');
      }
    }

    // Cập nhật dữ liệu (partial update)
    const updatedUser = await this.prisma.nguoiDung.update({
      where: { tai_khoan: userId },
      data: {
        ho_ten: updateUserDto.ho_ten ?? existingUser.ho_ten,
        email: updateUserDto.email ?? existingUser.email,
        so_dt: updateUserDto.so_dt ?? existingUser.so_dt,
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
}

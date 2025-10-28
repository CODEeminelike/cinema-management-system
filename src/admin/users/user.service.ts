// src/admin/users/user.service.ts
import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../sys/prisma/prisma.service';
import { TokenService } from '../../sys/token/token.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';

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

interface PaginatedUsersResponse {
  data: {
    tai_khoan: number;
    ho_ten: string;
    email: string;
    so_dt: string | null;
    loai_nguoi_dung: string;
    createdAt: Date | null;
  }[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
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

  async getUserTypes(): Promise<any> {
    const result = await this.prisma.nguoiDung.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        loai_nguoi_dung: true,
      },
      distinct: ['loai_nguoi_dung'],
      orderBy: {
        loai_nguoi_dung: 'asc',
      },
    });

    return result.map((item) => item.loai_nguoi_dung);
  }

  async getUserList() {
    return this.prisma.nguoiDung.findMany({
      where: { deletedAt: null },
      select: {
        tai_khoan: true,
        ho_ten: true,
        email: true,
        so_dt: true,
        loai_nguoi_dung: true,
      },
    });
  }

  async getUserListPaginated(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<PaginatedUsersResponse> {
    const skip = (page - 1) * pageSize;

    const [users, total] = await Promise.all([
      this.prisma.nguoiDung.findMany({
        where: { deletedAt: null }, // Lọc bỏ bản ghi đã xóa mềm
        select: {
          tai_khoan: true,
          ho_ten: true,
          email: true,
          so_dt: true,
          loai_nguoi_dung: true,
          createdAt: true,
        },
        skip,
        take: pageSize,
        orderBy: { tai_khoan: 'desc' }, // Sắp xếp mặc định theo tai_khoan giảm dần
      }),
      this.prisma.nguoiDung.count({
        where: { deletedAt: null },
      }),
    ]);

    return {
      data: users,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
        hasNext: page * pageSize < total,
        hasPrev: page > 1,
      },
    };
  }

  async searchUsers(
    keyword?: string,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<PaginatedUsersResponse> {
    this.logger.log(
      `Tìm kiếm người dùng với keyword: ${keyword || 'Không có'}, page: ${page}, pageSize: ${pageSize}`,
    );

    const skip = (page - 1) * pageSize;
    const lowerKeyword = keyword ? `%${keyword.toLowerCase()}%` : ''; // Thêm % cho LIKE

    // Xây dựng query raw cho findMany với parameterized để tránh SQL injection
    const users = (await this.prisma.$queryRaw`
    SELECT 
      tai_khoan, 
      ho_ten, 
      email, 
      so_dt, 
      loai_nguoi_dung, 
      createdAt
    FROM NguoiDung
    WHERE deletedAt IS NULL
    ${
      keyword
        ? Prisma.sql`AND (
      LOWER(ho_ten) LIKE ${lowerKeyword} OR 
      LOWER(email) LIKE ${lowerKeyword} OR 
      LOWER(so_dt) LIKE ${lowerKeyword}
    )`
        : Prisma.empty
    }
    ORDER BY tai_khoan DESC
    LIMIT ${pageSize} OFFSET ${skip}
  `) as {
      tai_khoan: number;
      ho_ten: string;
      email: string;
      so_dt: string | null;
      loai_nguoi_dung: string;
      createdAt: Date | null;
    }[];

    // Query raw cho count với parameterized
    const totalResult = (await this.prisma.$queryRaw`
    SELECT COUNT(*) as total
    FROM NguoiDung
    WHERE deletedAt IS NULL
    ${
      keyword
        ? Prisma.sql`AND (
      LOWER(ho_ten) LIKE ${lowerKeyword} OR 
      LOWER(email) LIKE ${lowerKeyword} OR 
      LOWER(so_dt) LIKE ${lowerKeyword}
    )`
        : Prisma.empty
    }
  `) as { total: number }[];

    const total = Number(totalResult[0]?.total ?? 0);

    return {
      data: users,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
        hasNext: page * pageSize < total,
        hasPrev: page > 1,
      },
    };
  }

  async searchUsersNoPag(keyword?: string): Promise<any> {
    this.logger.log(
      `Tìm kiếm người dùng không phân trang với keyword: ${keyword || 'Không có'}`,
    );

    const lowerKeyword = keyword ? `%${keyword.toLowerCase()}%` : ''; // Thêm % cho LIKE
    const maxLimit = 100; // Giới hạn mặc định để tránh tải dữ liệu lớn

    // Query raw cho findMany với parameterized để tránh SQL injection
    const usersQuery = Prisma.sql`
      SELECT 
        tai_khoan, 
        ho_ten, 
        email, 
        so_dt, 
        loai_nguoi_dung, 
        createdAt
      FROM NguoiDung
      WHERE deletedAt IS NULL
      ${
        keyword
          ? Prisma.sql`AND (
        LOWER(ho_ten) LIKE ${lowerKeyword} OR 
        LOWER(email) LIKE ${lowerKeyword} OR 
        LOWER(so_dt) LIKE ${lowerKeyword}
      )`
          : Prisma.empty
      }
      ORDER BY tai_khoan DESC
      LIMIT ${maxLimit}
    `;

    const users = (await this.prisma.$queryRaw(usersQuery)) as {
      tai_khoan: number;
      ho_ten: string;
      email: string;
      so_dt: string | null;
      loai_nguoi_dung: string;
      createdAt: Date | null;
    }[];

    // Query raw cho count để kiểm tra nếu vượt giới hạn
    const countQuery = Prisma.sql`
      SELECT COUNT(*) as total
      FROM NguoiDung
      WHERE deletedAt IS NULL
      ${
        keyword
          ? Prisma.sql`AND (
        LOWER(ho_ten) LIKE ${lowerKeyword} OR 
        LOWER(email) LIKE ${lowerKeyword} OR 
        LOWER(so_dt) LIKE ${lowerKeyword}
      )`
          : Prisma.empty
      }
    `;

    const totalResult = (await this.prisma.$queryRaw(countQuery)) as {
      total: number;
    }[];
    const total = Number(totalResult[0]?.total ?? 0);

    // Xử lý nếu dữ liệu quá lớn
    if (total > maxLimit) {
      throw new BadRequestException(
        `Kết quả tìm kiếm vượt quá ${maxLimit} bản ghi. Vui lòng sử dụng endpoint TimKiemNguoiDungPhanTrang để xử lý dữ liệu lớn.`,
      );
    }

    return { data: users };
  }
}

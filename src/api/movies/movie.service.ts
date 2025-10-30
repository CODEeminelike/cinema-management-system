import {
  Injectable,
  NotFoundException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../sys/prisma/prisma.service';
import { GetMoviesDto } from './dto/get-movies.dto';
import { GetMovieListDto } from './dto/get-movie-list.dto';
import { GetMoviesByDateDto } from './dto/get-movies-by-date.dto';

interface MovieResponse {
  ma_phim: number;
  ten_phim: string;
  trailer: string | null;
  hinh_anh: string | null;
  mo_ta: string | null;
  ngay_khoi_chieu: Date | null;
  danh_gia: number | null;
  hot: boolean | null;
  dang_chieu: boolean | null;
  sap_chieu: boolean | null;
}
interface BannerResponse {
  ma_banner: number;
  ma_phim: number | null;
  hinh_anh: string | null;
  ten_phim?: string | null; // Optional
}
interface PaginatedMovieResponse {
  data: MovieResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

@Injectable()
export class MovieService {
  private readonly logger = new Logger(MovieService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getMovieList(dto: GetMovieListDto = {}): Promise<MovieResponse[]> {
    const { tenPhim } = dto;

    // Xây dựng where clause động
    const where: any = { deletedAt: null };

    if (tenPhim) {
      where.ten_phim = {
        contains: tenPhim,
        // Không sử dụng mode: 'insensitive' vì MySQL mặc định case-insensitive
      };
    }

    try {
      const movies = await this.prisma.phim.findMany({
        where,
        select: {
          ma_phim: true,
          ten_phim: true,
          trailer: true,
          hinh_anh: true,
          mo_ta: true,
          ngay_khoi_chieu: true,
          danh_gia: true,
          hot: true,
          dang_chieu: true,
          sap_chieu: true,
        },
      });

      if (movies.length === 0) {
        throw new NotFoundException('Không tìm thấy phim nào phù hợp');
      }

      this.logger.log(
        `Lấy danh sách phim thành công: ${movies.length} kết quả`,
      );
      return movies;
    } catch (error: any) {
      this.logger.error(`Lỗi khi lấy danh sách phim: ${error.message}`);
      throw error;
    }
  }

  async getMovieListFiltered(
    dto: GetMoviesDto,
  ): Promise<PaginatedMovieResponse> {
    const { page = 1, limit = 10, tenPhim, dangChieu, sapChieu, hot } = dto;

    if (page < 1 || limit < 1 || limit > 100) {
      throw new BadRequestException(
        'Invalid pagination parameters: page must be >= 1, limit must be between 1 and 100',
      );
    }

    const skip = (page - 1) * limit;

    // Xây dựng where clause động
    const where: any = { deletedAt: null };

    if (tenPhim) {
      where.ten_phim = {
        contains: tenPhim,
      };
    }

    if (dangChieu !== undefined) {
      where.dang_chieu = dangChieu;
    }

    if (sapChieu !== undefined) {
      where.sap_chieu = sapChieu;
    }

    if (hot !== undefined) {
      where.hot = hot;
    }

    try {
      // Đếm tổng số phim phù hợp với filter
      const total = await this.prisma.phim.count({ where });

      if (total === 0) {
        throw new NotFoundException(
          'Không tìm thấy phim nào phù hợp với filter',
        );
      }

      // Lấy danh sách phim với phân trang và filter
      const movies = await this.prisma.phim.findMany({
        where,
        select: {
          ma_phim: true,
          ten_phim: true,
          trailer: true,
          hinh_anh: true,
          mo_ta: true,
          ngay_khoi_chieu: true,
          danh_gia: true,
          hot: true,
          dang_chieu: true,
          sap_chieu: true,
        },
        orderBy: { ma_phim: 'desc' }, // Sắp xếp theo mã phim giảm dần (có thể điều chỉnh)
        skip,
        take: limit,
      });

      const totalPages = Math.ceil(total / limit);

      this.logger.log(
        `Lấy danh sách phim phân trang và filter thành công: page ${page}, limit ${limit}, total ${total}`,
      );

      return {
        data: movies,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      };
    } catch (error: any) {
      this.logger.error(
        `Lỗi khi lấy danh sách phim phân trang và filter: ${error.message}`,
      );
      throw error;
    }
  }

  async getMovieInfo(ma_phim: number): Promise<MovieResponse> {
    try {
      const movie = await this.prisma.phim.findUnique({
        where: {
          ma_phim,
          deletedAt: null,
        },
        select: {
          ma_phim: true,
          ten_phim: true,
          trailer: true,
          hinh_anh: true,
          mo_ta: true,
          ngay_khoi_chieu: true,
          danh_gia: true,
          hot: true,
          dang_chieu: true,
          sap_chieu: true,
        },
      });

      if (!movie) {
        throw new NotFoundException(`Không tìm thấy phim với mã ${ma_phim}`);
      }

      this.logger.log(`Lấy thông tin phim thành công: mã phim ${ma_phim}`);
      return movie;
    } catch (error: any) {
      this.logger.error(`Lỗi khi lấy thông tin phim: ${error.message}`);
      throw error;
    }
  }

  async getMovieListByDate(
    dto: GetMoviesByDateDto,
  ): Promise<PaginatedMovieResponse> {
    const { tuNgay, denNgay, page = 1, limit = 10 } = dto;

    if (page < 1 || limit < 1 || limit > 100) {
      throw new BadRequestException(
        'Invalid pagination parameters: page must be >= 1, limit must be between 1 and 100',
      );
    }

    // Parse ngày nếu có (từ string ISO sang Date)
    let startDate: Date | undefined;
    let endDate: Date | undefined;
    if (tuNgay) {
      startDate = new Date(tuNgay);
      if (isNaN(startDate.getTime())) {
        throw new BadRequestException('TuNgay không hợp lệ');
      }
    }
    if (denNgay) {
      endDate = new Date(denNgay);
      if (isNaN(endDate.getTime())) {
        throw new BadRequestException('DenNgay không hợp lệ');
      }
    }

    // Xây dựng where clause động
    const where: any = { deletedAt: null };

    if (startDate || endDate) {
      where.ngay_khoi_chieu = {};
      if (startDate) {
        where.ngay_khoi_chieu.gte = startDate;
      }
      if (endDate) {
        where.ngay_khoi_chieu.lte = endDate;
      }
    }

    const skip = (page - 1) * limit;

    try {
      // Đếm tổng số phim phù hợp
      const total = await this.prisma.phim.count({ where });

      if (total === 0) {
        throw new NotFoundException(
          'Không tìm thấy phim nào phù hợp với khoảng ngày',
        );
      }

      // Lấy danh sách phim với phân trang và filter
      const movies = await this.prisma.phim.findMany({
        where,
        select: {
          ma_phim: true,
          ten_phim: true,
          trailer: true,
          hinh_anh: true,
          mo_ta: true,
          ngay_khoi_chieu: true,
          danh_gia: true,
          hot: true,
          dang_chieu: true,
          sap_chieu: true,
        },
        orderBy: { ngay_khoi_chieu: 'asc' }, // Sắp xếp theo ngày khởi chiếu tăng dần (có thể điều chỉnh)
        skip,
        take: limit,
      });

      const totalPages = Math.ceil(total / limit);

      this.logger.log(
        `Lấy danh sách phim theo ngày thành công: page ${page}, limit ${limit}, total ${total}`,
      );

      return {
        data: movies,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      };
    } catch (error: any) {
      this.logger.error(
        `Lỗi khi lấy danh sách phim theo ngày: ${error.message}`,
      );
      throw error;
    }
  }

  async getBannerList() {
    try {
      const banners = await this.prisma.banner.findMany({
        where: {
          deletedAt: null, // Lọc soft delete
        },
        include: {
          Phim: true, // Include đầy đủ data của Phim liên kết
        },
      });

      if (banners.length === 0) {
        throw new NotFoundException('Không tìm thấy banner nào');
      }

      this.logger.log(
        `Lấy danh sách banner với đầy đủ data phim thành công: ${banners.length} kết quả`,
      );
      return banners;
    } catch (error: any) {
      this.logger.error(`Lỗi khi lấy danh sách banner: ${error.message}`);
      throw error;
    }
  }
}

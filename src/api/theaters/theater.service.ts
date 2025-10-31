import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../sys/prisma/prisma.service';

interface CinemaSystemResponse {
  ma_he_thong_rap: number;
  ten_he_thong_rap: string;
  logo: string | null;
}

interface CinemaClusterResponse {
  ma_cum_rap: number;
  ten_cum_rap: string;
  dia_chi: string;
  rap_phim: {
    ma_rap: number;
    ten_rap: string;
  }[]; // Nested list RapPhim
}

@Injectable()
export class TheaterService {
  private readonly logger = new Logger(TheaterService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getCinemaSystems(): Promise<CinemaSystemResponse[]> {
    try {
      const systems = await this.prisma.heThongRap.findMany({
        where: {
          deletedAt: null, // Filter soft deletes
        },
        select: {
          ma_he_thong_rap: true,
          ten_he_thong_rap: true,
          logo: true,
        },
      });

      if (systems.length === 0) {
        throw new NotFoundException('Không tìm thấy hệ thống rạp');
      }

      this.logger.log(
        `Retrieved cinema systems successfully: ${systems.length} results`,
      );

      return systems;
    } catch (error) {
      throw error;
    }
  }

  async getCinemaClustersBySystem(
    maHeThong: string,
  ): Promise<CinemaClusterResponse[]> {
    const maHeThongRap = parseInt(maHeThong, 10);

    if (isNaN(maHeThongRap)) {
      throw new BadRequestException(
        'Mã hệ thống rạp không hợp lệ (phải là số)',
      );
    }

    try {
      // Kiểm tra hệ thống tồn tại
      const systemExists = await this.prisma.heThongRap.findUnique({
        where: { ma_he_thong_rap: maHeThongRap, deletedAt: null },
      });

      if (!systemExists) {
        throw new NotFoundException(
          `Không tìm thấy hệ thống rạp với mã ${maHeThong}`,
        );
      }

      // Truy vấn CumRap theo ma_he_thong_rap, include RapPhim
      const clusters = await this.prisma.cumRap.findMany({
        where: {
          ma_he_thong_rap: maHeThongRap,
          deletedAt: null,
        },
        select: {
          ma_cum_rap: true,
          ten_cum_rap: true,
          dia_chi: true,
          RapPhim: {
            select: {
              ma_rap: true,
              ten_rap: true,
            },
            where: { deletedAt: null },
          },
        },
      });

      if (clusters.length === 0) {
        throw new NotFoundException(
          `Không tìm thấy cụm rạp nào cho hệ thống ${maHeThong}`,
        );
      }

      this.logger.log(
        `Lấy thông tin cụm rạp cho hệ thống ${maHeThong} thành công: ${clusters.length} kết quả`,
      );

      // Map với destructuring để loại bỏ "RapPhim" gốc, chỉ giữ các trường cần và rename thành "rap_phim"
      return clusters.map(({ ma_cum_rap, ten_cum_rap, dia_chi, RapPhim }) => ({
        ma_cum_rap,
        ten_cum_rap,
        dia_chi,
        rap_phim: RapPhim,
      })) as CinemaClusterResponse[];
    } catch (error) {
      throw error;
    }
  }
  async getShowtimes(ma_phim?: number, ma_rap?: number) {
    const where: any = {};

    if (ma_phim) {
      where.ma_phim = ma_phim;
    }

    if (ma_rap) {
      where.ma_rap = ma_rap;
    }

    const showtimes = await this.prisma.lichChieu.findMany({
      where: {
        ...where,
        deletedAt: null, // Bổ sung lọc soft delete để cải thiện
      },
      include: {
        Phim: {
          select: {
            ten_phim: true,
            hinh_anh: true,
          },
        },
        RapPhim: {
          include: {
            CumRap: {
              include: {
                HeThongRap: {
                  select: {
                    ten_he_thong_rap: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        ngay_gio_chieu: 'asc',
      },
    });

    return showtimes;
  }
}

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { PrismaService } from '../../sys/prisma/prisma.service';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async createShowtime(createShowtimeDto: CreateShowtimeDto) {
    const { ma_phim, ma_rap, ngay_gio_chieu, gia_ve } = createShowtimeDto;

    // 1. Check if movie exists
    const movie = await this.prisma.phim.findUnique({
      where: { ma_phim },
    });
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    // 2. Check if theater exists
    const theater = await this.prisma.rapPhim.findUnique({
      where: { ma_rap },
    });
    if (!theater) {
      throw new NotFoundException('Theater not found');
    }

    // 3. Check for overlapping showtimes (2 hours buffer)
    const showTimeDate = new Date(ngay_gio_chieu);
    const existingShowtime = await this.prisma.lichChieu.findFirst({
      where: {
        ma_rap,
        ngay_gio_chieu: {
          gte: new Date(showTimeDate.getTime() - 2 * 60 * 60 * 1000), // 2 hours before
          lte: new Date(showTimeDate.getTime() + 2 * 60 * 60 * 1000), // 2 hours after
        },
      },
    });
    if (existingShowtime) {
      throw new BadRequestException(
        'Theater already has a showtime scheduled in this time slot',
      );
    }

    // 4. Create showtime
    const showtime = await this.prisma.lichChieu.create({
      data: {
        ma_rap,
        ma_phim,
        ngay_gio_chieu: showTimeDate,
        gia_ve,
      },
    });
    return showtime;
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

  async getShowtimeById(ma_lich_chieu: number) {
    const showtime = await this.prisma.lichChieu.findUnique({
      where: {
        ma_lich_chieu,
        deletedAt: null, // Bổ sung lọc soft delete để cải thiện
      },
      include: {
        Phim: true,
        RapPhim: {
          include: {
            CumRap: {
              include: {
                HeThongRap: true,
              },
            },
            Ghe: {
              where: {
                deletedAt: null,
              },
            },
          },
        },
        DatVe: {
          include: {
            Ghe: true,
            NguoiDung: {
              select: {
                ho_ten: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!showtime) {
      throw new NotFoundException('Showtime not found');
    }

    return showtime;
  }
}

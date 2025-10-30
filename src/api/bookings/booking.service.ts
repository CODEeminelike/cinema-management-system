import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';

import { PrismaService } from 'sys/prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

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

  async createBooking(tai_khoan: number, createBookingDto: CreateBookingDto) {
    const { ma_lich_chieu, danh_sach_ma_ghe } = createBookingDto;

    // Transaction để đảm bảo tính nguyên tử
    return this.prisma.$transaction(async (prisma) => {
      // 1. Kiểm tra lịch chiếu tồn tại và trong tương lai
      const lichChieu = await prisma.lichChieu.findUnique({
        where: { ma_lich_chieu, deletedAt: null },
        include: { RapPhim: true },
      });
      if (!lichChieu) {
        throw new NotFoundException('Lịch chiếu không tồn tại');
      }
      if (new Date(lichChieu.ngay_gio_chieu) <= new Date()) {
        // Dựa trên ngày hiện tại
        throw new BadRequestException('Lịch chiếu đã hết hạn');
      }

      // 2. Kiểm tra ghế tồn tại, thuộc rạp, và còn trống
      const gheList = await prisma.ghe.findMany({
        where: {
          ma_ghe: { in: danh_sach_ma_ghe },
          ma_rap: lichChieu.ma_rap,
          deletedAt: null,
        },
      });
      if (gheList.length !== danh_sach_ma_ghe.length) {
        throw new BadRequestException(
          'Một số ghế không tồn tại hoặc không thuộc rạp',
        );
      }

      // Kiểm tra ghế đã được đặt
      const datVeExisting = await prisma.datVe.findMany({
        where: {
          ma_lich_chieu,
          ma_ghe: { in: danh_sach_ma_ghe },
        },
      });
      if (datVeExisting.length > 0) {
        throw new ForbiddenException('Một số ghế đã được đặt');
      }

      // 3. Tạo đặt vé cho từng ghế
      const bookings = await Promise.all(
        danh_sach_ma_ghe.map((ma_ghe) =>
          prisma.datVe.create({
            data: {
              tai_khoan,
              ma_lich_chieu,
              ma_ghe,
            },
          }),
        ),
      );

      // 4. Tính tổng giá (tùy chọn, để trả về)
      const tong_gia = lichChieu.gia_ve * danh_sach_ma_ghe.length;

      return { bookings, tong_gia };
    });
  }

  async getRoomSeats(ma_lich_chieu: number) {
    // 1. Lấy thông tin lịch chiếu với include cần thiết
    const lichChieu = await this.prisma.lichChieu.findUnique({
      where: {
        ma_lich_chieu,
        deletedAt: null,
      },
      include: {
        Phim: true,
        RapPhim: {
          include: {
            CumRap: true,
          },
        },
        DatVe: {
          select: {
            ma_ghe: true,
            tai_khoan: true,
          },
        },
      },
    });

    if (!lichChieu) {
      throw new NotFoundException('Lịch chiếu không tồn tại');
    }

    // Kiểm tra lịch chiếu trong tương lai (dựa trên ngày hiện tại: October 30, 2025)
    const currentDate = new Date('2025-10-30');
    if (new Date(lichChieu.ngay_gio_chieu) <= currentDate) {
      throw new BadRequestException('Lịch chiếu đã hết hạn');
    }

    // Kiểm tra các quan hệ bắt buộc
    if (!lichChieu.RapPhim) {
      throw new NotFoundException(
        'Không tìm thấy thông tin rạp cho lịch chiếu',
      );
    }
    if (!lichChieu.RapPhim.CumRap) {
      throw new NotFoundException(
        'Không tìm thấy thông tin cụm rạp cho lịch chiếu',
      );
    }
    if (!lichChieu.Phim) {
      throw new NotFoundException(
        'Không tìm thấy thông tin phim cho lịch chiếu',
      );
    }

    // 2. Lấy danh sách ghế cho rạp
    const danhSachGhe = await this.prisma.ghe.findMany({
      where: {
        ma_rap: lichChieu.ma_rap,
        deletedAt: null,
      },
      orderBy: {
        ma_ghe: 'asc', // Sắp xếp theo mã ghế
      },
    });

    // 3. Xây dựng danhSachGhe với trạng thái đặt vé
    const datVeMap = new Map(
      lichChieu.DatVe.map((dv) => [dv.ma_ghe, dv.tai_khoan]),
    );
    const formattedDanhSachGhe = danhSachGhe.map((ghe) => ({
      maGhe: ghe.ma_ghe,
      tenGhe: ghe.ten_ghe,
      maRap: ghe.ma_rap,
      loaiGhe:
        ghe.loai_ghe.charAt(0).toUpperCase() +
        ghe.loai_ghe.slice(1).toLowerCase(), // Map "thuong" thành "Thuong"
      stt: ghe.ten_ghe.padStart(2, '0'), // Giả sử stt là ten_ghe với padding
      giaVe: lichChieu.gia_ve,
      daDat: datVeMap.has(ghe.ma_ghe),
      taiKhoanNguoiDat: datVeMap.get(ghe.ma_ghe) || null,
    }));

    // 4. Xây dựng thongTinPhim
    const ngayGioChieu = new Date(lichChieu.ngay_gio_chieu);
    const thongTinPhim = {
      maLichChieu: lichChieu.ma_lich_chieu,
      tenCumRap: lichChieu.RapPhim.CumRap.ten_cum_rap,
      tenRap: lichChieu.RapPhim.ten_rap,
      diaChi: lichChieu.RapPhim.CumRap.dia_chi,
      tenPhim: lichChieu.Phim.ten_phim,
      hinhAnh: lichChieu.Phim.hinh_anh,
      ngayChieu: ngayGioChieu.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      gioChieu: ngayGioChieu.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    return {
      thongTinPhim,
      danhSachGhe: formattedDanhSachGhe,
    };
  }
}

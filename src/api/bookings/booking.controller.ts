import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Query,
  Param,
  ParseIntPipe,
  Req,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtAuthGuard } from '../../shared/guards/auth/jwt-auth.guard'; // Import guard để sử dụng
import { BookingsService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('QuanLyDatVe')
@Controller('QuanLyDatVe')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post('LayThongTinLichChieuHeThongRap')
  async getShowtimes(
    @Query('ma_phim') ma_phim?: string,
    @Query('ma_rap') ma_rap?: string,
  ) {
    const ma_phim_num = ma_phim ? parseInt(ma_phim) : undefined;
    const ma_rap_num = ma_rap ? parseInt(ma_rap) : undefined;

    const showtimes = await this.bookingsService.getShowtimes(
      ma_phim_num,
      ma_rap_num,
    );

    return {
      message: 'Showtimes retrieved successfully',
      data: showtimes,
    };
  }

  @Post('DatVe')
  @UseGuards(JwtAuthGuard) // Thêm guard để yêu cầu xác thực JWT
  async createBooking(
    @Body() createBookingDto: CreateBookingDto,
    @Req() req: any,
  ) {
    const tai_khoan = req.user.userId; // Sửa thành userId, dựa trên object từ JwtStrategy
    if (!tai_khoan) {
      throw new UnauthorizedException(
        'Không thể xác định tài khoản người dùng',
      );
    }
    const booking = await this.bookingsService.createBooking(
      tai_khoan,
      createBookingDto,
    );
    return {
      message: 'Đặt vé thành công',
      data: booking,
    };
  }

  @Get('showtimes/:ma_lich_chieu')
  async getShowtimeById(
    @Param('ma_lich_chieu', ParseIntPipe) ma_lich_chieu: number,
  ) {
    const showtime = await this.bookingsService.getShowtimeById(ma_lich_chieu);

    return {
      message: 'Showtime retrieved successfully',
      data: showtime,
    };
  }

  @Get('LayDanhSachPhongVe')
  async getRoomSeats(@Query('maLichChieu', ParseIntPipe) maLichChieu: number) {
    const roomSeats = await this.bookingsService.getRoomSeats(maLichChieu);
    return {
      statusCode: 200,
      message: 'Xử lý thành công!',
      content: roomSeats,
    };
  }
}

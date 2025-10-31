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

import { JwtAuthGuard } from '../../shared/guards/auth/jwt-auth.guard';
import { BookingsService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('QuanLyDatVe')
@Controller('QuanLyDatVe')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post('DatVe')
  @UseGuards(JwtAuthGuard)
  async createBooking(
    @Body() createBookingDto: CreateBookingDto,
    @Req() req: any,
  ) {
    const tai_khoan = req.user.userId;
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

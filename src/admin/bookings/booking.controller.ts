import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Query,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../shared/guards/auth/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles/roles.guard';
import { Roles } from '../../shared/guards/roles/roles.decorator';
import { BookingsService } from './booking.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('QuanLyDatVe')
@Controller('QuanLyDatVe')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post('TaoLichChieu')
  async createShowtime(@Body() createShowtimeDto: CreateShowtimeDto) {
    const showtime =
      await this.bookingsService.createShowtime(createShowtimeDto);

    return {
      message: 'Showtime created successfully',
      data: showtime,
    };
  }

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

  @Get('showtimes/:ma_lich_chieu')
  @Roles('ADMIN')
  async getShowtimeById(
    @Param('ma_lich_chieu', ParseIntPipe) ma_lich_chieu: number,
  ) {
    const showtime = await this.bookingsService.getShowtimeById(ma_lich_chieu);

    return {
      message: 'Showtime retrieved successfully',
      data: showtime,
    };
  }
}

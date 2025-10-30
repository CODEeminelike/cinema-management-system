import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { APP_CONSTANTS } from 'shared/constant/app.constant';
import { JwtAuthGuard } from 'shared/guards/auth/jwt-auth.guard';
import { Roles } from 'shared/guards/roles/roles.decorator';
import { RolesGuard } from 'shared/guards/roles/roles.guard';
import { TheaterService } from './theater.service';

@ApiTags('QuanLyRap')
@Controller('QuanLyRap')
export class TheaterController {
  constructor(private readonly theaterService: TheaterService) {}
  @Get('LayThongTinHeThongRap')
  getCinemaSystems() {
    return this.theaterService.getCinemaSystems();
  }

  @Get('LayThongTinCumRapTheoHeThong/:maHeThong') // Đổi thành GET với path param
  getCinemaClustersBySystem(@Param('maHeThong') maHeThong: string) {
    return this.theaterService.getCinemaClustersBySystem(maHeThong);
  }

  @Post(['LayThongTinLichChieuHeThongRap', 'LayThongTinLichChieuPhim'])
  async getShowtimes(
    @Query('ma_phim') ma_phim?: string,
    @Query('ma_rap') ma_rap?: string,
  ) {
    const ma_phim_num = ma_phim ? parseInt(ma_phim) : undefined;
    const ma_rap_num = ma_rap ? parseInt(ma_rap) : undefined;

    const showtimes = await this.theaterService.getShowtimes(
      ma_phim_num,
      ma_rap_num,
    );

    return {
      message: 'Showtimes retrieved successfully',
      data: showtimes,
    };
  }
}

import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TheaterService } from './theater.service';

@ApiTags('QuanLyRap')
@Controller('QuanLyRap')
export class TheaterController {
  constructor(private readonly theaterService: TheaterService) {}
  @Get('LayThongTinHeThongRap')
  getCinemaSystems() {
    return this.theaterService.getCinemaSystems();
  }

  @Get('LayThongTinCumRapTheoHeThong/:maHeThong')
  getCinemaClustersBySystem(@Param('maHeThong') maHeThong: string) {
    return this.theaterService.getCinemaClustersBySystem(maHeThong);
  }

  @Post(['LayThongTinLichChieuHeThongRap', 'LayThongTinLichChieuPhim'])
  @HttpCode(HttpStatus.OK)
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

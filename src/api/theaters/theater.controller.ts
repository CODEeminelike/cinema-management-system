import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
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
}

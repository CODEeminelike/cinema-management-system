import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { APP_CONSTANTS } from 'shared/constant/app.constant';
import { JwtAuthGuard } from 'shared/guards/auth/jwt-auth.guard';
import { Roles } from 'shared/guards/roles/roles.decorator';
import { RolesGuard } from 'shared/guards/roles/roles.guard';

@Controller('QuanLyRap')
export class TheaterController {
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('LayThongTinHeThongRap')
  getCinemaSystems() {
    return 'LayThongTinHeThongRap';
  }
  @Post('LayThongTinHeThongRap2')
  getCinemaSystems2() {
    return 'LayThongTinHeThongRap22';
  }
}

import { Controller, Get } from '@nestjs/common';
import { APP_CONSTANTS } from 'shared/constant/app.constant';

@Controller("QuanLyRap") // Chỉ định route con 'QuanLyRap'
export class TheaterController {
  @Get('LayThongTinHeThongRap')
  getCinemaSystems() {
    return 'LayThongTinHeThongRap';
  }
}
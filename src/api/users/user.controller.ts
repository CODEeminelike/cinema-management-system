import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
  Get,
  Put,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UserValidationPipe } from 'shared/pipes/user-validation.pipe';
import { UsersService } from './user.service';
import { LoginValidationPipe } from 'shared/pipes/login-validation.pipe';
import { RefreshValidationPipe } from 'shared/pipes/refresh-validation.pipe';
import { JwtAuthGuard } from 'shared/guards/auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('QuanLyNguoiDung')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('DangKy')
  async register(@Body(UserValidationPipe) userDto: CreateUserDto) {
    return await this.usersService.register(userDto);
  }

  @Post('DangNhap')
  @HttpCode(HttpStatus.OK)
  async login(@Body(LoginValidationPipe) loginDto: LoginDto) {
    return await this.usersService.login(loginDto);
  }

  @Post('LamMoiToken')
  async refresh(@Body(RefreshValidationPipe) refreshTokenDto: RefreshTokenDto) {
    return await this.usersService.refresh(refreshTokenDto.refreshToken);
  }

  @Post('DangXuat')
  async logout(@Body(RefreshValidationPipe) refreshTokenDto: RefreshTokenDto) {
    await this.usersService.logout(refreshTokenDto.refreshToken);
    return { message: 'Đăng xuất thành công' };
  }

  @Get('ThongTinTaiKhoan')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: Request) {
    const userId = req.user!.userId;
    return this.usersService.getProfile(userId);
  }

  @Put('CapNhatThongTinNguoiDung')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateProfile(@Body(UserValidationPipe) updateUserDto: UpdateUserDto) {}
}

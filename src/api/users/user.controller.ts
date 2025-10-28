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
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UsersService } from './user.service';
import { JwtAuthGuard } from 'shared/guards/auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('QuanLyNguoiDung')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('DangKy')
  async register(@Body() userDto: CreateUserDto) {
    return await this.usersService.register(userDto);
  }

  @Post('DangNhap')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return await this.usersService.login(loginDto);
  }

  @Post('LamMoiToken')
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return await this.usersService.refresh(refreshTokenDto.refreshToken);
  }

  @Post('DangXuat')
  async logout(@Body() refreshTokenDto: RefreshTokenDto) {
    await this.usersService.logout(refreshTokenDto.refreshToken);
    return { message: 'Đăng xuất thành công' };
  }

  @Get('ThongTinTaiKhoan')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: Request) {
    const user = req.user;
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.usersService.getProfile(user);
  }

  @Put('CapNhatThongTinNguoiDung')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
  ) {
    const user = req.user as { userId: number };
    return this.usersService.updateProfile(updateUserDto, user.userId);
  }
}

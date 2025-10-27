import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UserValidationPipe } from 'shared/pipes/user-validation.pipe';
import { UsersService } from './user.service';
import { LoginValidationPipe } from 'shared/pipes/login-validation.pipe';
import { RefreshValidationPipe } from 'shared/pipes/refresh-validation.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body(UserValidationPipe) userDto: CreateUserDto) {
    return await this.usersService.register(userDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body(LoginValidationPipe) loginDto: LoginDto) {
    return await this.usersService.login(loginDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body(RefreshValidationPipe) refreshTokenDto: RefreshTokenDto) {
    return await this.usersService.refresh(refreshTokenDto.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body(RefreshValidationPipe) refreshTokenDto: RefreshTokenDto) {
    await this.usersService.logout(refreshTokenDto.refreshToken);
    return { message: 'Đăng xuất thành công' };
  }
}

// src/admin/users/users.controller.ts
import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { JwtAuthGuard } from '../../shared/guards/auth/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles/roles.guard';
import { Roles } from '../../shared/guards/roles/roles.decorator';
import { retry } from 'rxjs';

@Controller('QuanLyNguoiDung') // Base route: /QuanLyNguoiDung
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('ThemNguoiDung')
  //   @UseGuards(JwtAuthGuard, RolesGuard) // Áp dụng xác thực JWT và kiểm tra role
  //   @Roles('ADMIN')
  async addAccount(@Body() createAdminDto: CreateAdminDto) {
    return this.usersService.addAccount(createAdminDto);
  }

  @Get('test')
  async test() {
    return {
      data: 'success-test',
    };
  }
}

// src/admin/users/dto/create-admin.dto.ts
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsEnum,
} from 'class-validator';

export class CreateAdminDto {
  @IsString()
  @IsNotEmpty()
  ho_ten!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  so_dt?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  mat_khau!: string;

  @IsEnum(['ADMIN', 'USER'])
  @IsString()
  loai_nguoi_dung?: string = 'ADMIN';
}

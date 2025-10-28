// src/admin/users/dto/create-admin.dto.ts
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsEnum,
  Matches,
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
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
    {
      message:
        'Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt',
    },
  )
  mat_khau!: string;

  @IsEnum(['ADMIN', 'USER'])
  @IsString()
  loai_nguoi_dung?: string = 'ADMIN';
}

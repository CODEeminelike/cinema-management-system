import { UpdateUserDto } from 'api/users/dto/update-user.dto';
import {
  IsOptional,
  IsString,
  Matches,
  MinLength,
  IsEnum,
  isEnum,
  isNumber,
  IsNumber,
} from 'class-validator';

enum UserType {
  ADMIN = 'ADMIN',
  USER = 'USER',
  // Add other types as needed based on your domain
}

export class UpdateAdminUserDto extends UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'Mật khẩu phải là chuỗi' })
  @MinLength(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Mật khẩu phải chứa ít nhất một chữ cái thường, một chữ cái hoa, một số, và một ký tự đặc biệt',
    },
  )
  mat_khau?: string;

  @IsOptional()
  @IsEnum(UserType, { message: 'Loại người dùng không hợp lệ' })
  loai_nguoi_dung?: UserType;
}

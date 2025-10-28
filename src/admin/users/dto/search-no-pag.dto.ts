import { IsOptional, IsString } from 'class-validator';

export class SearchNoPagDto {
  @IsOptional()
  @IsString({ message: 'Keyword phải là chuỗi ký tự.' })
  keyword?: string; // Nếu không nhập, trả về tất cả người dùng
}

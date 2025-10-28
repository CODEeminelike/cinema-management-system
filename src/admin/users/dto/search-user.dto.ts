import { IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from './pagination.dto'; // Import nếu tách riêng

export class SearchUserDto extends PaginationDto {
  // Kế thừa từ PaginationDto để tích hợp phân trang
  @IsOptional()
  @IsString({ message: 'Keyword phải là chuỗi ký tự.' })
  keyword?: string; // Nếu không nhập, tìm kiếm tất cả
}

import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number) // Chuyển đổi tự động từ string sang number
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100) // Giới hạn để tránh truy vấn lớn
  @Type(() => Number)
  pageSize?: number = 10;
}

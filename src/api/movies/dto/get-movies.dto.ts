import {
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsString,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class GetMoviesDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Page phải là số nguyên' })
  @Min(1, { message: 'Page phải lớn hơn hoặc bằng 1' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Limit phải là số nguyên' })
  @Min(1, { message: 'Limit phải lớn hơn hoặc bằng 1' })
  @Max(100, { message: 'Limit không được vượt quá 100' })
  limit?: number = 10;

  @IsOptional()
  @IsString({ message: 'Tên phim phải là chuỗi ký tự' })
  tenPhim?: string;

  @IsOptional()
  @IsBoolean({ message: 'DangChieu phải là boolean' })
  @Type(() => Boolean)
  dangChieu?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'SapChieu phải là boolean' })
  @Type(() => Boolean)
  sapChieu?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'Hot phải là boolean' })
  @Type(() => Boolean)
  hot?: boolean;
}

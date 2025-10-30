import { IsOptional, IsNumber, Min, Max, IsISO8601 } from 'class-validator';
import { Type } from 'class-transformer';

export class GetMoviesByDateDto {
  @IsOptional()
  @IsISO8601(
    {},
    { message: 'TuNgay phải là định dạng ngày ISO 8601 (YYYY-MM-DD)' },
  )
  tuNgay?: string;

  @IsOptional()
  @IsISO8601(
    {},
    { message: 'DenNgay phải là định dạng ngày ISO 8601 (YYYY-MM-DD)' },
  )
  denNgay?: string;

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
}

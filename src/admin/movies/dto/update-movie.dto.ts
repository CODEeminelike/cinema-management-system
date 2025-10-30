import {
  IsString,
  IsDateString,
  IsInt,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class UpdateMovieDto {
  @IsInt()
  ma_phim!: number; // Required để xác định phim cần update

  @IsString()
  @IsOptional()
  ten_phim?: string;

  @IsString()
  @IsOptional()
  trailer?: string;

  @IsString()
  @IsOptional()
  mo_ta?: string;

  @IsDateString()
  @IsOptional()
  ngay_khoi_chieu?: string; // Format: YYYY-MM-DD

  @IsInt()
  @IsOptional()
  danh_gia?: number;

  @IsBoolean()
  @IsOptional()
  hot?: boolean;

  @IsBoolean()
  @IsOptional()
  dang_chieu?: boolean;

  @IsBoolean()
  @IsOptional()
  sap_chieu?: boolean;
}

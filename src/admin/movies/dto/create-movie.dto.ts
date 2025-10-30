import {
  IsString,
  IsDateString,
  IsInt,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateMovieDto {
  @IsString()
  ten_phim!: string;

  @IsString()
  @IsOptional()
  trailer?: string;

  @IsString()
  @IsOptional()
  mo_ta?: string;

  @IsDateString()
  ngay_khoi_chieu!: string; // Format: YYYY-MM-DD

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

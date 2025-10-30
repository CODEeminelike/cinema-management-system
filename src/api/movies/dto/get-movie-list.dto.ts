import { IsOptional, IsString } from 'class-validator';

export class GetMovieListDto {
  @IsOptional()
  @IsString({ message: 'Tên phim phải là chuỗi ký tự' })
  tenPhim?: string;
}

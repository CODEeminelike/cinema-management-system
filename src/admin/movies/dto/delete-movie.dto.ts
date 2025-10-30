import { IsInt } from 'class-validator';

export class DeleteMovieDto {
  @IsInt()
  ma_phim!: number;
}

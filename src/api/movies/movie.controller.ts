import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { MovieService } from './movie.service';
import { GetMoviesDto } from './dto/get-movies.dto';
import { GetMovieListDto } from './dto/get-movie-list.dto';
import { GetMoviesByDateDto } from './dto/get-movies-by-date.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('QuanLyPhim')
@Controller('QuanLyPhim')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get('LayDanhSachPhim')
  getMovieList(@Query() dto: GetMovieListDto) {
    return this.movieService.getMovieList(dto);
  }

  @Get('LayDanhSachPhimPhanTrang')
  getMovieListPaginated(@Query() dto: GetMoviesDto) {
    return this.movieService.getMovieListFiltered(dto);
  }

  @Get('LayThongTinPhim/:ma_phim')
  getMovieInfo(@Param('ma_phim', ParseIntPipe) ma_phim: number) {
    return this.movieService.getMovieInfo(ma_phim);
  }
  @Get('LayDanhSachPhimTheoNgay')
  getMovieListByDate(@Query() dto: GetMoviesByDateDto) {
    return this.movieService.getMovieListByDate(dto);
  }

  @Get('LayDanhSachBanner')
  getBannerList() {
    return this.movieService.getBannerList();
  }
}

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovieController = void 0;
const common_1 = require("@nestjs/common");
const movie_service_1 = require("./movie.service");
const get_movies_dto_1 = require("./dto/get-movies.dto");
const get_movie_list_dto_1 = require("./dto/get-movie-list.dto");
const get_movies_by_date_dto_1 = require("./dto/get-movies-by-date.dto");
const swagger_1 = require("@nestjs/swagger");
let MovieController = class MovieController {
    movieService;
    constructor(movieService) {
        this.movieService = movieService;
    }
    getMovieList(dto) {
        return this.movieService.getMovieList(dto);
    }
    getMovieListPaginated(dto) {
        return this.movieService.getMovieListFiltered(dto);
    }
    getMovieInfo(ma_phim) {
        return this.movieService.getMovieInfo(ma_phim);
    }
    getMovieListByDate(dto) {
        return this.movieService.getMovieListByDate(dto);
    }
    getBannerList() {
        return this.movieService.getBannerList();
    }
};
exports.MovieController = MovieController;
__decorate([
    (0, common_1.Get)('LayDanhSachPhim'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_movie_list_dto_1.GetMovieListDto]),
    __metadata("design:returntype", void 0)
], MovieController.prototype, "getMovieList", null);
__decorate([
    (0, common_1.Get)('LayDanhSachPhimPhanTrang'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_movies_dto_1.GetMoviesDto]),
    __metadata("design:returntype", void 0)
], MovieController.prototype, "getMovieListPaginated", null);
__decorate([
    (0, common_1.Get)('LayThongTinPhim/:ma_phim'),
    __param(0, (0, common_1.Param)('ma_phim', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MovieController.prototype, "getMovieInfo", null);
__decorate([
    (0, common_1.Get)('LayDanhSachPhimTheoNgay'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_movies_by_date_dto_1.GetMoviesByDateDto]),
    __metadata("design:returntype", void 0)
], MovieController.prototype, "getMovieListByDate", null);
__decorate([
    (0, common_1.Get)('LayDanhSachBanner'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MovieController.prototype, "getBannerList", null);
exports.MovieController = MovieController = __decorate([
    (0, swagger_1.ApiTags)('QuanLyPhim'),
    (0, common_1.Controller)('QuanLyPhim'),
    __metadata("design:paramtypes", [movie_service_1.MovieService])
], MovieController);
//# sourceMappingURL=movie.controller.js.map
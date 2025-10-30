"use strict";
//src\admin\movies\movie.controller.ts
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
exports.MoviesController = void 0;
const roles_decorator_1 = require("./../../shared/guards/roles/roles.decorator");
const roles_guard_1 = require("./../../shared/guards/roles/roles.guard");
const jwt_auth_guard_1 = require("shared/guards/auth/jwt-auth.guard");
const common_1 = require("@nestjs/common");
const cloudinary_upload_interceptor_1 = require("./../../shared/interceptors/cloudinary-upload.interceptor");
const movie_service_1 = require("./movie.service");
const delete_movie_dto_1 = require("./dto/delete-movie.dto");
const swagger_1 = require("@nestjs/swagger");
let MoviesController = class MoviesController {
    moviesService;
    constructor(moviesService) {
        this.moviesService = moviesService;
    }
    async addMovie(data, hinh_anh) {
        if (!data) {
            throw new common_1.BadRequestException('Data field is required');
        }
        const movie = await this.moviesService.createMovie(data, hinh_anh);
        return {
            message: 'Movie added successfully',
            data: movie,
        };
    }
    async updateMovie(data, hinh_anh) {
        if (!data) {
            throw new common_1.BadRequestException('Data field is required');
        }
        const movie = await this.moviesService.updateMovie(data, hinh_anh);
        return {
            message: 'Movie updated successfully',
            data: movie,
        };
    }
    async deleteMovie(body) {
        const movie = await this.moviesService.deleteMovie(body.ma_phim);
        return {
            message: 'Movie deleted successfully (soft delete)',
            data: movie,
        };
    }
};
exports.MoviesController = MoviesController;
__decorate([
    (0, common_1.Post)('ThemPhimUploadHinh'),
    (0, common_1.UseInterceptors)(cloudinary_upload_interceptor_1.CloudinaryUploadInterceptor) // Sử dụng CloudinaryUploadInterceptor
    ,
    __param(0, (0, common_1.Body)('data')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "addMovie", null);
__decorate([
    (0, common_1.Post)('CapNhatPhimUpload'),
    (0, common_1.UseInterceptors)(cloudinary_upload_interceptor_1.CloudinaryUploadInterceptor),
    __param(0, (0, common_1.Body)('data')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "updateMovie", null);
__decorate([
    (0, common_1.Delete)('XoaPhim'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_movie_dto_1.DeleteMovieDto]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "deleteMovie", null);
exports.MoviesController = MoviesController = __decorate([
    (0, swagger_1.ApiTags)('QuanLyPhim'),
    (0, common_1.Controller)('QuanLyPhim'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __metadata("design:paramtypes", [movie_service_1.MoviesService])
], MoviesController);
//# sourceMappingURL=movie.controller.js.map
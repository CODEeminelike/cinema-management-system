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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoviesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../sys/prisma/prisma.service");
const cloudinary_service_1 = require("../../sys/cloudinary/cloudinary.service");
let MoviesService = class MoviesService {
    prisma;
    cloudinaryService;
    constructor(prisma, cloudinaryService) {
        this.prisma = prisma;
        this.cloudinaryService = cloudinaryService;
    }
    async createMovie(dataString, file) {
        let parsedData;
        try {
            parsedData = JSON.parse(dataString);
        }
        catch (error) {
            throw new common_1.BadRequestException('Invalid JSON in data field');
        }
        let hinh_anh;
        if (file) {
            try {
                hinh_anh = await this.cloudinaryService.uploadImage(file.buffer, {
                    folder: 'img_movie', // Folder tùy chỉnh cho phim
                });
            }
            catch (error) {
                throw new common_1.BadRequestException('Failed to upload image');
            }
        }
        // Tạo phim trong database
        const movie = await this.prisma.phim.create({
            data: {
                ten_phim: parsedData.ten_phim,
                trailer: parsedData.trailer,
                hinh_anh,
                mo_ta: parsedData.mo_ta,
                ngay_khoi_chieu: new Date(parsedData.ngay_khoi_chieu),
                danh_gia: parsedData.danh_gia,
                hot: parsedData.hot ?? false,
                dang_chieu: parsedData.dang_chieu ?? false,
                sap_chieu: parsedData.sap_chieu ?? false,
            },
        });
        return movie;
    }
    // ... Các import và constructor hiện tại ...
    async updateMovie(dataString, file) {
        let parsedData;
        try {
            parsedData = JSON.parse(dataString);
        }
        catch (error) {
            throw new common_1.BadRequestException('Invalid JSON in data field');
        }
        // Tìm phim hiện tại để lấy ảnh cũ
        const existingMovie = await this.prisma.phim.findUnique({
            where: { ma_phim: parsedData.ma_phim },
        });
        if (!existingMovie) {
            throw new common_1.BadRequestException('Movie not found');
        }
        let newHinhAnh = existingMovie.hinh_anh ?? undefined;
        let oldHinhAnh = existingMovie.hinh_anh ?? undefined;
        if (file) {
            try {
                newHinhAnh = await this.cloudinaryService.uploadImage(file.buffer, {
                    folder: 'img_movie',
                });
            }
            catch (error) {
                throw new common_1.BadRequestException('Failed to upload new image');
            }
        }
        try {
            // Update phim trong database
            const updatedMovie = await this.prisma.phim.update({
                where: { ma_phim: parsedData.ma_phim },
                data: {
                    ten_phim: parsedData.ten_phim ?? existingMovie.ten_phim,
                    trailer: parsedData.trailer ?? existingMovie.trailer,
                    hinh_anh: newHinhAnh,
                    mo_ta: parsedData.mo_ta ?? existingMovie.mo_ta,
                    ngay_khoi_chieu: parsedData.ngay_khoi_chieu
                        ? new Date(parsedData.ngay_khoi_chieu)
                        : existingMovie.ngay_khoi_chieu,
                    danh_gia: parsedData.danh_gia ?? existingMovie.danh_gia,
                    hot: parsedData.hot ?? existingMovie.hot,
                    dang_chieu: parsedData.dang_chieu ?? existingMovie.dang_chieu,
                    sap_chieu: parsedData.sap_chieu ?? existingMovie.sap_chieu,
                },
            });
            // Xóa ảnh cũ nếu có ảnh mới và ảnh cũ tồn tại
            if (file && oldHinhAnh) {
                this.cloudinaryService.deleteImageByUrl(oldHinhAnh).catch((err) => {
                    // Silent error: Không throw, chỉ log nếu cần
                    console.error('Failed to delete old image:', err);
                });
            }
            return updatedMovie;
        }
        catch (error) {
            // Rollback: Xóa ảnh mới nếu update thất bại và có ảnh mới
            if (file && newHinhAnh) {
                this.cloudinaryService.deleteImageByUrl(newHinhAnh).catch(() => { });
            }
            throw error;
        }
    }
    async deleteMovie(ma_phim) {
        // Tìm phim hiện tại
        const existingMovie = await this.prisma.phim.findUnique({
            where: { ma_phim },
        });
        if (!existingMovie) {
            throw new common_1.NotFoundException('Movie not found');
        }
        // Xóa ảnh trên Cloudinary nếu tồn tại
        if (existingMovie.hinh_anh) {
            try {
                await this.cloudinaryService.deleteImageByUrl(existingMovie.hinh_anh);
            }
            catch (error) {
                // Silent error: Không throw, chỉ log để tránh block soft delete
                console.error('Failed to delete image:', error);
            }
        }
        // Soft delete bằng cách update deletedAt
        const deletedMovie = await this.prisma.phim.update({
            where: { ma_phim },
            data: { deletedAt: new Date() },
        });
        return deletedMovie;
    }
};
exports.MoviesService = MoviesService;
exports.MoviesService = MoviesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cloudinary_service_1.CloudinaryService])
], MoviesService);
//# sourceMappingURL=movie.service.js.map
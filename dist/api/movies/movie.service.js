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
var MovieService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovieService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("sys/prisma/prisma.service");
let MovieService = MovieService_1 = class MovieService {
    prisma;
    logger = new common_1.Logger(MovieService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMovieList(dto = {}) {
        const { tenPhim } = dto;
        // Xây dựng where clause động
        const where = { deletedAt: null };
        if (tenPhim) {
            where.ten_phim = {
                contains: tenPhim,
                // Không sử dụng mode: 'insensitive' vì MySQL mặc định case-insensitive
            };
        }
        try {
            const movies = await this.prisma.phim.findMany({
                where,
                select: {
                    ma_phim: true,
                    ten_phim: true,
                    trailer: true,
                    hinh_anh: true,
                    mo_ta: true,
                    ngay_khoi_chieu: true,
                    danh_gia: true,
                    hot: true,
                    dang_chieu: true,
                    sap_chieu: true,
                },
            });
            if (movies.length === 0) {
                throw new common_1.NotFoundException('Không tìm thấy phim nào phù hợp');
            }
            this.logger.log(`Lấy danh sách phim thành công: ${movies.length} kết quả`);
            return movies;
        }
        catch (error) {
            this.logger.error(`Lỗi khi lấy danh sách phim: ${error.message}`);
            throw error;
        }
    }
    async getMovieListFiltered(dto) {
        const { page = 1, limit = 10, tenPhim, dangChieu, sapChieu, hot } = dto;
        if (page < 1 || limit < 1 || limit > 100) {
            throw new common_1.BadRequestException('Invalid pagination parameters: page must be >= 1, limit must be between 1 and 100');
        }
        const skip = (page - 1) * limit;
        // Xây dựng where clause động
        const where = { deletedAt: null };
        if (tenPhim) {
            where.ten_phim = {
                contains: tenPhim,
            };
        }
        if (dangChieu !== undefined) {
            where.dang_chieu = dangChieu;
        }
        if (sapChieu !== undefined) {
            where.sap_chieu = sapChieu;
        }
        if (hot !== undefined) {
            where.hot = hot;
        }
        try {
            // Đếm tổng số phim phù hợp với filter
            const total = await this.prisma.phim.count({ where });
            if (total === 0) {
                throw new common_1.NotFoundException('Không tìm thấy phim nào phù hợp với filter');
            }
            // Lấy danh sách phim với phân trang và filter
            const movies = await this.prisma.phim.findMany({
                where,
                select: {
                    ma_phim: true,
                    ten_phim: true,
                    trailer: true,
                    hinh_anh: true,
                    mo_ta: true,
                    ngay_khoi_chieu: true,
                    danh_gia: true,
                    hot: true,
                    dang_chieu: true,
                    sap_chieu: true,
                },
                orderBy: { ma_phim: 'desc' }, // Sắp xếp theo mã phim giảm dần (có thể điều chỉnh)
                skip,
                take: limit,
            });
            const totalPages = Math.ceil(total / limit);
            this.logger.log(`Lấy danh sách phim phân trang và filter thành công: page ${page}, limit ${limit}, total ${total}`);
            return {
                data: movies,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages,
                },
            };
        }
        catch (error) {
            this.logger.error(`Lỗi khi lấy danh sách phim phân trang và filter: ${error.message}`);
            throw error;
        }
    }
    async getMovieInfo(ma_phim) {
        try {
            const movie = await this.prisma.phim.findUnique({
                where: {
                    ma_phim,
                    deletedAt: null,
                },
                select: {
                    ma_phim: true,
                    ten_phim: true,
                    trailer: true,
                    hinh_anh: true,
                    mo_ta: true,
                    ngay_khoi_chieu: true,
                    danh_gia: true,
                    hot: true,
                    dang_chieu: true,
                    sap_chieu: true,
                },
            });
            if (!movie) {
                throw new common_1.NotFoundException(`Không tìm thấy phim với mã ${ma_phim}`);
            }
            this.logger.log(`Lấy thông tin phim thành công: mã phim ${ma_phim}`);
            return movie;
        }
        catch (error) {
            this.logger.error(`Lỗi khi lấy thông tin phim: ${error.message}`);
            throw error;
        }
    }
    async getMovieListByDate(dto) {
        const { tuNgay, denNgay, page = 1, limit = 10 } = dto;
        if (page < 1 || limit < 1 || limit > 100) {
            throw new common_1.BadRequestException('Invalid pagination parameters: page must be >= 1, limit must be between 1 and 100');
        }
        // Parse ngày nếu có (từ string ISO sang Date)
        let startDate;
        let endDate;
        if (tuNgay) {
            startDate = new Date(tuNgay);
            if (isNaN(startDate.getTime())) {
                throw new common_1.BadRequestException('TuNgay không hợp lệ');
            }
        }
        if (denNgay) {
            endDate = new Date(denNgay);
            if (isNaN(endDate.getTime())) {
                throw new common_1.BadRequestException('DenNgay không hợp lệ');
            }
        }
        // Xây dựng where clause động
        const where = { deletedAt: null };
        if (startDate || endDate) {
            where.ngay_khoi_chieu = {};
            if (startDate) {
                where.ngay_khoi_chieu.gte = startDate;
            }
            if (endDate) {
                where.ngay_khoi_chieu.lte = endDate;
            }
        }
        const skip = (page - 1) * limit;
        try {
            // Đếm tổng số phim phù hợp
            const total = await this.prisma.phim.count({ where });
            if (total === 0) {
                throw new common_1.NotFoundException('Không tìm thấy phim nào phù hợp với khoảng ngày');
            }
            // Lấy danh sách phim với phân trang và filter
            const movies = await this.prisma.phim.findMany({
                where,
                select: {
                    ma_phim: true,
                    ten_phim: true,
                    trailer: true,
                    hinh_anh: true,
                    mo_ta: true,
                    ngay_khoi_chieu: true,
                    danh_gia: true,
                    hot: true,
                    dang_chieu: true,
                    sap_chieu: true,
                },
                orderBy: { ngay_khoi_chieu: 'asc' }, // Sắp xếp theo ngày khởi chiếu tăng dần (có thể điều chỉnh)
                skip,
                take: limit,
            });
            const totalPages = Math.ceil(total / limit);
            this.logger.log(`Lấy danh sách phim theo ngày thành công: page ${page}, limit ${limit}, total ${total}`);
            return {
                data: movies,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages,
                },
            };
        }
        catch (error) {
            this.logger.error(`Lỗi khi lấy danh sách phim theo ngày: ${error.message}`);
            throw error;
        }
    }
    async getBannerList() {
        try {
            const banners = await this.prisma.banner.findMany({
                where: {
                    deletedAt: null, // Lọc soft delete
                },
                include: {
                    Phim: true, // Include đầy đủ data của Phim liên kết
                },
            });
            if (banners.length === 0) {
                throw new common_1.NotFoundException('Không tìm thấy banner nào');
            }
            this.logger.log(`Lấy danh sách banner với đầy đủ data phim thành công: ${banners.length} kết quả`);
            return banners;
        }
        catch (error) {
            this.logger.error(`Lỗi khi lấy danh sách banner: ${error.message}`);
            throw error;
        }
    }
};
exports.MovieService = MovieService;
exports.MovieService = MovieService = MovieService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MovieService);
//# sourceMappingURL=movie.service.js.map
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
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("sys/prisma/prisma.service");
let BookingsService = class BookingsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createShowtime(createShowtimeDto) {
        const { ma_phim, ma_rap, ngay_gio_chieu, gia_ve } = createShowtimeDto;
        // 1. Check if movie exists
        const movie = await this.prisma.phim.findUnique({
            where: { ma_phim },
        });
        if (!movie) {
            throw new common_1.NotFoundException('Movie not found');
        }
        // 2. Check if theater exists
        const theater = await this.prisma.rapPhim.findUnique({
            where: { ma_rap },
        });
        if (!theater) {
            throw new common_1.NotFoundException('Theater not found');
        }
        // 3. Check for overlapping showtimes (2 hours buffer)
        const showTimeDate = new Date(ngay_gio_chieu);
        const existingShowtime = await this.prisma.lichChieu.findFirst({
            where: {
                ma_rap,
                ngay_gio_chieu: {
                    gte: new Date(showTimeDate.getTime() - 2 * 60 * 60 * 1000), // 2 hours before
                    lte: new Date(showTimeDate.getTime() + 2 * 60 * 60 * 1000), // 2 hours after
                },
            },
        });
        if (existingShowtime) {
            throw new common_1.BadRequestException('Theater already has a showtime scheduled in this time slot');
        }
        // 4. Create showtime
        const showtime = await this.prisma.lichChieu.create({
            data: {
                ma_rap,
                ma_phim,
                ngay_gio_chieu: showTimeDate,
                gia_ve,
            },
        });
        return showtime;
    }
    async getShowtimes(ma_phim, ma_rap) {
        const where = {};
        if (ma_phim) {
            where.ma_phim = ma_phim;
        }
        if (ma_rap) {
            where.ma_rap = ma_rap;
        }
        const showtimes = await this.prisma.lichChieu.findMany({
            where: {
                ...where,
                deletedAt: null, // Bổ sung lọc soft delete để cải thiện
            },
            include: {
                Phim: {
                    select: {
                        ten_phim: true,
                        hinh_anh: true,
                    },
                },
                RapPhim: {
                    include: {
                        CumRap: {
                            include: {
                                HeThongRap: {
                                    select: {
                                        ten_he_thong_rap: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
            orderBy: {
                ngay_gio_chieu: 'asc',
            },
        });
        return showtimes;
    }
    async getShowtimeById(ma_lich_chieu) {
        const showtime = await this.prisma.lichChieu.findUnique({
            where: {
                ma_lich_chieu,
                deletedAt: null, // Bổ sung lọc soft delete để cải thiện
            },
            include: {
                Phim: true,
                RapPhim: {
                    include: {
                        CumRap: {
                            include: {
                                HeThongRap: true,
                            },
                        },
                        Ghe: {
                            where: {
                                deletedAt: null,
                            },
                        },
                    },
                },
                DatVe: {
                    include: {
                        Ghe: true,
                        NguoiDung: {
                            select: {
                                ho_ten: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });
        if (!showtime) {
            throw new common_1.NotFoundException('Showtime not found');
        }
        return showtime;
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BookingsService);
//# sourceMappingURL=booking.service.js.map
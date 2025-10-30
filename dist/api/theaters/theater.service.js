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
var TheaterService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TheaterService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("sys/prisma/prisma.service");
let TheaterService = TheaterService_1 = class TheaterService {
    prisma;
    logger = new common_1.Logger(TheaterService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCinemaSystems() {
        try {
            const systems = await this.prisma.heThongRap.findMany({
                where: {
                    deletedAt: null, // Filter soft deletes
                },
                select: {
                    ma_he_thong_rap: true,
                    ten_he_thong_rap: true,
                    logo: true,
                },
            });
            if (systems.length === 0) {
                throw new common_1.NotFoundException('No cinema systems found');
            }
            this.logger.log(`Retrieved cinema systems successfully: ${systems.length} results`);
            return systems;
        }
        catch (error) {
            throw error;
        }
    }
    async getCinemaClustersBySystem(maHeThong) {
        const maHeThongRap = parseInt(maHeThong, 10);
        if (isNaN(maHeThongRap)) {
            throw new common_1.BadRequestException('Mã hệ thống rạp không hợp lệ (phải là số)');
        }
        try {
            // Kiểm tra hệ thống tồn tại
            const systemExists = await this.prisma.heThongRap.findUnique({
                where: { ma_he_thong_rap: maHeThongRap, deletedAt: null },
            });
            if (!systemExists) {
                throw new common_1.NotFoundException(`Không tìm thấy hệ thống rạp với mã ${maHeThong}`);
            }
            // Truy vấn CumRap theo ma_he_thong_rap, include RapPhim
            const clusters = await this.prisma.cumRap.findMany({
                where: {
                    ma_he_thong_rap: maHeThongRap,
                    deletedAt: null,
                },
                select: {
                    ma_cum_rap: true,
                    ten_cum_rap: true,
                    dia_chi: true,
                    RapPhim: {
                        select: {
                            ma_rap: true,
                            ten_rap: true,
                        },
                        where: { deletedAt: null },
                    },
                },
            });
            if (clusters.length === 0) {
                throw new common_1.NotFoundException(`Không tìm thấy cụm rạp nào cho hệ thống ${maHeThong}`);
            }
            this.logger.log(`Lấy thông tin cụm rạp cho hệ thống ${maHeThong} thành công: ${clusters.length} kết quả`);
            // Map với destructuring để loại bỏ "RapPhim" gốc, chỉ giữ các trường cần và rename thành "rap_phim"
            return clusters.map(({ ma_cum_rap, ten_cum_rap, dia_chi, RapPhim }) => ({
                ma_cum_rap,
                ten_cum_rap,
                dia_chi,
                rap_phim: RapPhim,
            }));
        }
        catch (error) {
            throw error;
        }
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
};
exports.TheaterService = TheaterService;
exports.TheaterService = TheaterService = TheaterService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TheaterService);
//# sourceMappingURL=theater.service.js.map
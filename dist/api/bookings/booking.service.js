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
const prisma_service_1 = require("../../sys/prisma/prisma.service");
let BookingsService = class BookingsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createBooking(tai_khoan, createBookingDto) {
        const { ma_lich_chieu, danh_sach_ma_ghe } = createBookingDto;
        // Transaction để đảm bảo tính nguyên tử
        return this.prisma.$transaction(async (prisma) => {
            // 1. Kiểm tra lịch chiếu tồn tại và trong tương lai
            const lichChieu = await prisma.lichChieu.findUnique({
                where: { ma_lich_chieu, deletedAt: null },
                include: { RapPhim: true },
            });
            if (!lichChieu) {
                throw new common_1.NotFoundException('Lịch chiếu không tồn tại');
            }
            if (new Date(lichChieu.ngay_gio_chieu) <= new Date()) {
                // Dựa trên ngày hiện tại
                throw new common_1.BadRequestException('Lịch chiếu đã hết hạn');
            }
            // 2. Kiểm tra ghế tồn tại, thuộc rạp, và còn trống
            const gheList = await prisma.ghe.findMany({
                where: {
                    ma_ghe: { in: danh_sach_ma_ghe },
                    ma_rap: lichChieu.ma_rap,
                    deletedAt: null,
                },
            });
            if (gheList.length !== danh_sach_ma_ghe.length) {
                throw new common_1.BadRequestException('Một số ghế không tồn tại hoặc không thuộc rạp');
            }
            // Kiểm tra ghế đã được đặt
            const datVeExisting = await prisma.datVe.findMany({
                where: {
                    ma_lich_chieu,
                    ma_ghe: { in: danh_sach_ma_ghe },
                },
            });
            if (datVeExisting.length > 0) {
                throw new common_1.ForbiddenException('Một số ghế đã được đặt');
            }
            // 3. Tạo đặt vé cho từng ghế
            const bookings = await Promise.all(danh_sach_ma_ghe.map((ma_ghe) => prisma.datVe.create({
                data: {
                    tai_khoan,
                    ma_lich_chieu,
                    ma_ghe,
                },
            })));
            // 4. Tính tổng giá (tùy chọn, để trả về)
            const tong_gia = lichChieu.gia_ve * danh_sach_ma_ghe.length;
            return { bookings, tong_gia };
        });
    }
    async getRoomSeats(ma_lich_chieu) {
        // 1. Lấy thông tin lịch chiếu với include cần thiết
        const lichChieu = await this.prisma.lichChieu.findUnique({
            where: {
                ma_lich_chieu,
                deletedAt: null,
            },
            include: {
                Phim: true,
                RapPhim: {
                    include: {
                        CumRap: true,
                    },
                },
                DatVe: {
                    select: {
                        ma_ghe: true,
                        tai_khoan: true,
                    },
                },
            },
        });
        if (!lichChieu) {
            throw new common_1.NotFoundException('Lịch chiếu không tồn tại');
        }
        // Kiểm tra lịch chiếu trong tương lai (dựa trên ngày hiện tại: October 30, 2025)
        const currentDate = new Date('2025-10-30');
        if (new Date(lichChieu.ngay_gio_chieu) <= currentDate) {
            throw new common_1.BadRequestException('Lịch chiếu đã hết hạn');
        }
        // Kiểm tra các quan hệ bắt buộc
        if (!lichChieu.RapPhim) {
            throw new common_1.NotFoundException('Không tìm thấy thông tin rạp cho lịch chiếu');
        }
        if (!lichChieu.RapPhim.CumRap) {
            throw new common_1.NotFoundException('Không tìm thấy thông tin cụm rạp cho lịch chiếu');
        }
        if (!lichChieu.Phim) {
            throw new common_1.NotFoundException('Không tìm thấy thông tin phim cho lịch chiếu');
        }
        // 2. Lấy danh sách ghế cho rạp
        const danhSachGhe = await this.prisma.ghe.findMany({
            where: {
                ma_rap: lichChieu.ma_rap,
                deletedAt: null,
            },
            orderBy: {
                ma_ghe: 'asc', // Sắp xếp theo mã ghế
            },
        });
        // 3. Xây dựng danhSachGhe với trạng thái đặt vé
        const datVeMap = new Map(lichChieu.DatVe.map((dv) => [dv.ma_ghe, dv.tai_khoan]));
        const formattedDanhSachGhe = danhSachGhe.map((ghe) => ({
            maGhe: ghe.ma_ghe,
            tenGhe: ghe.ten_ghe,
            maRap: ghe.ma_rap,
            loaiGhe: ghe.loai_ghe.charAt(0).toUpperCase() +
                ghe.loai_ghe.slice(1).toLowerCase(),
            stt: ghe.ten_ghe.padStart(2, '0'),
            giaVe: lichChieu.gia_ve,
            daDat: datVeMap.has(ghe.ma_ghe),
            taiKhoanNguoiDat: datVeMap.get(ghe.ma_ghe) || null,
        }));
        // 4. Xây dựng thongTinPhim
        const ngayGioChieu = new Date(lichChieu.ngay_gio_chieu);
        const thongTinPhim = {
            maLichChieu: lichChieu.ma_lich_chieu,
            tenCumRap: lichChieu.RapPhim.CumRap.ten_cum_rap,
            tenRap: lichChieu.RapPhim.ten_rap,
            diaChi: lichChieu.RapPhim.CumRap.dia_chi,
            tenPhim: lichChieu.Phim.ten_phim,
            hinhAnh: lichChieu.Phim.hinh_anh,
            ngayChieu: ngayGioChieu.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            }),
            gioChieu: ngayGioChieu.toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
            }),
        };
        return {
            thongTinPhim,
            danhSachGhe: formattedDanhSachGhe,
        };
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BookingsService);
//# sourceMappingURL=booking.service.js.map
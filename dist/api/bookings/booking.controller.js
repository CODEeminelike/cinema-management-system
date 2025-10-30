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
exports.BookingsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../shared/guards/auth/jwt-auth.guard"); // Import guard để sử dụng
const booking_service_1 = require("./booking.service");
const create_booking_dto_1 = require("./dto/create-booking.dto");
const swagger_1 = require("@nestjs/swagger");
let BookingsController = class BookingsController {
    bookingsService;
    constructor(bookingsService) {
        this.bookingsService = bookingsService;
    }
    // @Post('LayThongTinLichChieuHeThongRap')
    // async getShowtimes(
    //   @Query('ma_phim') ma_phim?: string,
    //   @Query('ma_rap') ma_rap?: string,
    // ) {
    //   const ma_phim_num = ma_phim ? parseInt(ma_phim) : undefined;
    //   const ma_rap_num = ma_rap ? parseInt(ma_rap) : undefined;
    //   const showtimes = await this.bookingsService.getShowtimes(
    //     ma_phim_num,
    //     ma_rap_num,
    //   );
    //   return {
    //     message: 'Showtimes retrieved successfully',
    //     data: showtimes,
    //   };
    // }
    async createBooking(createBookingDto, req) {
        const tai_khoan = req.user.userId; // Sửa thành userId, dựa trên object từ JwtStrategy
        if (!tai_khoan) {
            throw new common_1.UnauthorizedException('Không thể xác định tài khoản người dùng');
        }
        const booking = await this.bookingsService.createBooking(tai_khoan, createBookingDto);
        return {
            message: 'Đặt vé thành công',
            data: booking,
        };
    }
    // @Get('showtimes/:ma_lich_chieu')
    // async getShowtimeById(
    //   @Param('ma_lich_chieu', ParseIntPipe) ma_lich_chieu: number,
    // ) {
    //   const showtime = await this.bookingsService.getShowtimeById(ma_lich_chieu);
    //   return {
    //     message: 'Showtime retrieved successfully',
    //     data: showtime,
    //   };
    // }
    async getRoomSeats(maLichChieu) {
        const roomSeats = await this.bookingsService.getRoomSeats(maLichChieu);
        return {
            statusCode: 200,
            message: 'Xử lý thành công!',
            content: roomSeats,
        };
    }
};
exports.BookingsController = BookingsController;
__decorate([
    (0, common_1.Post)('DatVe'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard) // Thêm guard để yêu cầu xác thực JWT
    ,
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_booking_dto_1.CreateBookingDto, Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "createBooking", null);
__decorate([
    (0, common_1.Get)('LayDanhSachPhongVe'),
    __param(0, (0, common_1.Query)('maLichChieu', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "getRoomSeats", null);
exports.BookingsController = BookingsController = __decorate([
    (0, swagger_1.ApiTags)('QuanLyDatVe'),
    (0, common_1.Controller)('QuanLyDatVe'),
    __metadata("design:paramtypes", [booking_service_1.BookingsService])
], BookingsController);
//# sourceMappingURL=booking.controller.js.map
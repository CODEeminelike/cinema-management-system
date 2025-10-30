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
const jwt_auth_guard_1 = require("../../shared/guards/auth/jwt-auth.guard");
const roles_guard_1 = require("../../shared/guards/roles/roles.guard");
const roles_decorator_1 = require("../../shared/guards/roles/roles.decorator");
const booking_service_1 = require("./booking.service");
const create_showtime_dto_1 = require("./dto/create-showtime.dto");
const swagger_1 = require("@nestjs/swagger");
let BookingsController = class BookingsController {
    bookingsService;
    constructor(bookingsService) {
        this.bookingsService = bookingsService;
    }
    async createShowtime(createShowtimeDto) {
        const showtime = await this.bookingsService.createShowtime(createShowtimeDto);
        return {
            message: 'Showtime created successfully',
            data: showtime,
        };
    }
};
exports.BookingsController = BookingsController;
__decorate([
    (0, common_1.Post)('TaoLichChieu'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_showtime_dto_1.CreateShowtimeDto]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "createShowtime", null);
exports.BookingsController = BookingsController = __decorate([
    (0, swagger_1.ApiTags)('QuanLyDatVe'),
    (0, common_1.Controller)('QuanLyDatVe'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('ADMIN'),
    __metadata("design:paramtypes", [booking_service_1.BookingsService])
], BookingsController);
//# sourceMappingURL=booking.controller.js.map
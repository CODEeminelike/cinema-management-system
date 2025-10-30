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
exports.TheaterController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const theater_service_1 = require("./theater.service");
let TheaterController = class TheaterController {
    theaterService;
    constructor(theaterService) {
        this.theaterService = theaterService;
    }
    getCinemaSystems() {
        return this.theaterService.getCinemaSystems();
    }
    getCinemaClustersBySystem(maHeThong) {
        return this.theaterService.getCinemaClustersBySystem(maHeThong);
    }
    async getShowtimes(ma_phim, ma_rap) {
        const ma_phim_num = ma_phim ? parseInt(ma_phim) : undefined;
        const ma_rap_num = ma_rap ? parseInt(ma_rap) : undefined;
        const showtimes = await this.theaterService.getShowtimes(ma_phim_num, ma_rap_num);
        return {
            message: 'Showtimes retrieved successfully',
            data: showtimes,
        };
    }
};
exports.TheaterController = TheaterController;
__decorate([
    (0, common_1.Get)('LayThongTinHeThongRap'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TheaterController.prototype, "getCinemaSystems", null);
__decorate([
    (0, common_1.Get)('LayThongTinCumRapTheoHeThong/:maHeThong') // Đổi thành GET với path param
    ,
    __param(0, (0, common_1.Param)('maHeThong')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TheaterController.prototype, "getCinemaClustersBySystem", null);
__decorate([
    (0, common_1.Post)(['LayThongTinLichChieuHeThongRap', 'LayThongTinLichChieuPhim']),
    __param(0, (0, common_1.Query)('ma_phim')),
    __param(1, (0, common_1.Query)('ma_rap')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TheaterController.prototype, "getShowtimes", null);
exports.TheaterController = TheaterController = __decorate([
    (0, swagger_1.ApiTags)('QuanLyRap'),
    (0, common_1.Controller)('QuanLyRap'),
    __metadata("design:paramtypes", [theater_service_1.TheaterService])
], TheaterController);
//# sourceMappingURL=theater.controller.js.map
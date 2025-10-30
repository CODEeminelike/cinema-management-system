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
exports.CreateShowtimeDto = void 0;
const class_validator_1 = require("class-validator");
class CreateShowtimeDto {
    ma_phim;
    ma_rap;
    ngay_gio_chieu;
    gia_ve;
}
exports.CreateShowtimeDto = CreateShowtimeDto;
__decorate([
    (0, class_validator_1.IsInt)({ message: 'Mã phim phải là số nguyên' }),
    (0, class_validator_1.IsPositive)({ message: 'Mã phim phải là số dương' }),
    __metadata("design:type", Number)
], CreateShowtimeDto.prototype, "ma_phim", void 0);
__decorate([
    (0, class_validator_1.IsInt)({ message: 'Mã rạp phải là số nguyên' }),
    (0, class_validator_1.IsPositive)({ message: 'Mã rạp phải là số dương' }),
    __metadata("design:type", Number)
], CreateShowtimeDto.prototype, "ma_rap", void 0);
__decorate([
    (0, class_validator_1.IsDateString)({}, { message: 'Ngày giờ chiếu phải là định dạng ngày tháng hợp lệ' }),
    __metadata("design:type", String)
], CreateShowtimeDto.prototype, "ngay_gio_chieu", void 0);
__decorate([
    (0, class_validator_1.IsInt)({ message: 'Giá vé phải là số nguyên' }),
    (0, class_validator_1.Min)(0, { message: 'Giá vé không được nhỏ hơn 0' }),
    __metadata("design:type", Number)
], CreateShowtimeDto.prototype, "gia_ve", void 0);
//# sourceMappingURL=create-showtime.dto.js.map
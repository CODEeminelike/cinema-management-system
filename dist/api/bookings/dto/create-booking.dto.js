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
exports.CreateBookingDto = void 0;
const class_validator_1 = require("class-validator");
class CreateBookingDto {
    ma_lich_chieu;
    danh_sach_ma_ghe; // Danh sách mã ghế
}
exports.CreateBookingDto = CreateBookingDto;
__decorate([
    (0, class_validator_1.IsInt)({ message: 'Mã lịch chiếu phải là số nguyên' }),
    (0, class_validator_1.IsPositive)({ message: 'Mã lịch chiếu phải là số dương' }),
    __metadata("design:type", Number)
], CreateBookingDto.prototype, "ma_lich_chieu", void 0);
__decorate([
    (0, class_validator_1.IsArray)({ message: 'Danh sách ghế phải là mảng' }),
    (0, class_validator_1.ArrayNotEmpty)({ message: 'Danh sách ghế không được rỗng' }),
    (0, class_validator_1.ArrayUnique)({ message: 'Ghế không được trùng lặp' }),
    (0, class_validator_1.ArrayMinSize)(1, { message: 'Phải chọn ít nhất 1 ghế' }),
    __metadata("design:type", Array)
], CreateBookingDto.prototype, "danh_sach_ma_ghe", void 0);
//# sourceMappingURL=create-booking.dto.js.map
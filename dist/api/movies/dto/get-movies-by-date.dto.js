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
exports.GetMoviesByDateDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class GetMoviesByDateDto {
    tuNgay;
    denNgay;
    page = 1;
    limit = 10;
}
exports.GetMoviesByDateDto = GetMoviesByDateDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsISO8601)({}, { message: 'TuNgay phải là định dạng ngày ISO 8601 (YYYY-MM-DD)' }),
    __metadata("design:type", String)
], GetMoviesByDateDto.prototype, "tuNgay", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsISO8601)({}, { message: 'DenNgay phải là định dạng ngày ISO 8601 (YYYY-MM-DD)' }),
    __metadata("design:type", String)
], GetMoviesByDateDto.prototype, "denNgay", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: 'Page phải là số nguyên' }),
    (0, class_validator_1.Min)(1, { message: 'Page phải lớn hơn hoặc bằng 1' }),
    __metadata("design:type", Number)
], GetMoviesByDateDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: 'Limit phải là số nguyên' }),
    (0, class_validator_1.Min)(1, { message: 'Limit phải lớn hơn hoặc bằng 1' }),
    (0, class_validator_1.Max)(100, { message: 'Limit không được vượt quá 100' }),
    __metadata("design:type", Number)
], GetMoviesByDateDto.prototype, "limit", void 0);
//# sourceMappingURL=get-movies-by-date.dto.js.map
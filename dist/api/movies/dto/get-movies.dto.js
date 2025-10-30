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
exports.GetMoviesDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class GetMoviesDto {
    page = 1;
    limit = 10;
    tenPhim;
    dangChieu;
    sapChieu;
    hot;
}
exports.GetMoviesDto = GetMoviesDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: 'Page phải là số nguyên' }),
    (0, class_validator_1.Min)(1, { message: 'Page phải lớn hơn hoặc bằng 1' }),
    __metadata("design:type", Number)
], GetMoviesDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)({}, { message: 'Limit phải là số nguyên' }),
    (0, class_validator_1.Min)(1, { message: 'Limit phải lớn hơn hoặc bằng 1' }),
    (0, class_validator_1.Max)(100, { message: 'Limit không được vượt quá 100' }),
    __metadata("design:type", Number)
], GetMoviesDto.prototype, "limit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Tên phim phải là chuỗi ký tự' }),
    __metadata("design:type", String)
], GetMoviesDto.prototype, "tenPhim", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'DangChieu phải là boolean' }),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], GetMoviesDto.prototype, "dangChieu", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'SapChieu phải là boolean' }),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], GetMoviesDto.prototype, "sapChieu", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'Hot phải là boolean' }),
    (0, class_transformer_1.Type)(() => Boolean),
    __metadata("design:type", Boolean)
], GetMoviesDto.prototype, "hot", void 0);
//# sourceMappingURL=get-movies.dto.js.map
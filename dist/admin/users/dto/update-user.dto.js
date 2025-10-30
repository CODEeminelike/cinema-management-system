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
exports.UpdateAdminUserDto = void 0;
const update_user_dto_1 = require("api/users/dto/update-user.dto");
const class_validator_1 = require("class-validator");
var UserType;
(function (UserType) {
    UserType["ADMIN"] = "ADMIN";
    UserType["USER"] = "USER";
    // Add other types as needed based on your domain
})(UserType || (UserType = {}));
class UpdateAdminUserDto extends update_user_dto_1.UpdateUserDto {
    mat_khau;
    loai_nguoi_dung;
}
exports.UpdateAdminUserDto = UpdateAdminUserDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Mật khẩu phải là chuỗi' }),
    (0, class_validator_1.MinLength)(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' }),
    (0, class_validator_1.Matches)(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
        message: 'Mật khẩu phải chứa ít nhất một chữ cái thường, một chữ cái hoa, một số, và một ký tự đặc biệt',
    }),
    __metadata("design:type", String)
], UpdateAdminUserDto.prototype, "mat_khau", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(UserType, { message: 'Loại người dùng không hợp lệ' }),
    __metadata("design:type", String)
], UpdateAdminUserDto.prototype, "loai_nguoi_dung", void 0);
//# sourceMappingURL=update-user.dto.js.map
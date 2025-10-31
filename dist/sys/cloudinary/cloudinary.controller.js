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
exports.CloudinaryController = void 0;
const common_1 = require("@nestjs/common");
const cloudinary_upload_interceptor_1 = require("../../shared/interceptors/cloudinary-upload.interceptor");
const cloudinary_service_1 = require("./cloudinary.service");
let CloudinaryController = class CloudinaryController {
    cloudinaryService;
    constructor(cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
    }
    async uploadTest(image, description) {
        if (!image) {
            throw new common_1.BadRequestException('No image file provided');
        }
        const imageUrl = await this.cloudinaryService.uploadImage(image.buffer, {
            tags: ['test-upload'],
        });
        return {
            message: 'Tải lên thành công',
            url: imageUrl,
            description: description || 'Không có mô tả được cung cấp',
            originalName: image.originalname,
            size: image.size,
        };
    }
    async deleteTest(imageUrl) {
        if (!imageUrl) {
            throw new common_1.BadRequestException('URL hình ảnh là bắt buộc');
        }
        const result = await this.cloudinaryService.deleteImageByUrl(imageUrl);
        return {
            message: 'Đã xóa hình ảnh thành công',
            deleted: result,
        };
    }
};
exports.CloudinaryController = CloudinaryController;
__decorate([
    (0, common_1.Post)('upload-test'),
    (0, common_1.UseInterceptors)(cloudinary_upload_interceptor_1.CloudinaryUploadInterceptor),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('description')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CloudinaryController.prototype, "uploadTest", null);
__decorate([
    (0, common_1.Delete)('delete-test'),
    __param(0, (0, common_1.Body)('imageUrl')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CloudinaryController.prototype, "deleteTest", null);
exports.CloudinaryController = CloudinaryController = __decorate([
    (0, common_1.Controller)('cloudinary'),
    __metadata("design:paramtypes", [cloudinary_service_1.CloudinaryService])
], CloudinaryController);
//# sourceMappingURL=cloudinary.controller.js.map
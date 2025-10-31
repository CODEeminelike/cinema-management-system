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
exports.CloudinaryService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cloudinary_1 = require("cloudinary");
let CloudinaryService = class CloudinaryService {
    configService;
    constructor(configService) {
        this.configService = configService;
        const cloudName = this.configService.get('CLOUDINARY_CLOUD_NAME');
        const apiKey = this.configService.get('CLOUDINARY_API_KEY');
        const apiSecret = this.configService.get('CLOUDINARY_API_SECRET');
        cloudinary_1.v2.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret,
        });
    }
    async uploadImage(fileBuffer, options) {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                folder: 'img_movie',
                ...options,
            }, (error, result) => {
                if (error) {
                    reject(new Error(`Tải lên Cloudinary thất bại: ${error.message}`));
                }
                else if (!result) {
                    reject(new Error('Tải lên Cloudinary thất bại: Không có kết quả nào được trả về'));
                }
                else {
                    resolve(result.secure_url);
                }
            });
            uploadStream.end(fileBuffer);
        });
    }
    async deleteImage(publicId) {
        try {
            const result = await cloudinary_1.v2.uploader.destroy(publicId);
            return result.result === 'ok';
        }
        catch (error) {
            throw new Error(`Xóa từ Cloudinary thất bại: ${error.message}`);
        }
    }
    async deleteImageByUrl(imageUrl) {
        try {
            const publicId = this.extractPublicIdFromUrl(imageUrl);
            return await this.deleteImage(publicId);
        }
        catch (error) {
            throw new Error(`Xóa từ Cloudinary thất bại: ${error.message}`);
        }
    }
    extractPublicIdFromUrl(url) {
        const matches = url.match(/\/upload\/(?:v\d+\/)?(.+)\.(?:jpg|jpeg|png|gif|webp)/i);
        if (!matches || matches.length < 2) {
            throw new Error('URL Cloudinary không hợp lệ');
        }
        return matches[1].replace(/\.[^/.]+$/, '');
    }
};
exports.CloudinaryService = CloudinaryService;
exports.CloudinaryService = CloudinaryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CloudinaryService);
//# sourceMappingURL=cloudinary.service.js.map
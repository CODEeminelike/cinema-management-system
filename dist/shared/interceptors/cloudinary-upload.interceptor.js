"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryUploadInterceptor = void 0;
const platform_express_1 = require("@nestjs/platform-express");
exports.CloudinaryUploadInterceptor = (0, platform_express_1.FileInterceptor)('hinh_anh', {
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/image\/(jpeg|png|gif|jpg|webp)/)) {
            return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
    },
});
//# sourceMappingURL=cloudinary-upload.interceptor.js.map
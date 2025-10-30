import { FileInterceptor } from '@nestjs/platform-express';

export const CloudinaryUploadInterceptor = FileInterceptor('hinh_anh', {
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    if (!file.mimetype.match(/image\/(jpeg|png|gif|jpg|webp)/)) {
      return callback(new Error('Only image files are allowed!'), false);
    }
    callback(null, true);
  },
});

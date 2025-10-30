import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CloudinaryUploadInterceptor } from '../../shared/interceptors/cloudinary-upload.interceptor';
import { CloudinaryService } from './cloudinary.service';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('upload-test')
  @UseInterceptors(CloudinaryUploadInterceptor)
  async uploadTest(
    @UploadedFile() image: Express.Multer.File,
    @Body('description') description?: string,
  ) {
    if (!image) {
      throw new BadRequestException('No image file provided');
    }

    const imageUrl = await this.cloudinaryService.uploadImage(image.buffer, {
      tags: ['test-upload'],
    });

    return {
      message: 'Upload successful',
      url: imageUrl,
      description: description || 'No description provided',
      originalName: image.originalname,
      size: image.size,
    };
  }

  @Delete('delete-test')
  async deleteTest(@Body('imageUrl') imageUrl: string) {
    if (!imageUrl) {
      throw new BadRequestException('Image URL is required');
    }

    const result = await this.cloudinaryService.deleteImageByUrl(imageUrl);

    return {
      message: 'Image deleted successfully',
      deleted: result,
    };
  }
}

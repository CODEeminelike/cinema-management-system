import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    const cloudName = this.configService.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.configService.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.configService.get<string>('CLOUDINARY_API_SECRET');

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
  }

  async uploadImage(fileBuffer: Buffer, options?: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'img_movie',
          ...options,
        },
        (error, result) => {
          if (error) {
            reject(new Error(`Upload to Cloudinary failed: ${error.message}`));
          } else if (!result) {
            reject(
              new Error('Upload to Cloudinary failed: No result returned'),
            );
          } else {
            resolve(result.secure_url);
          }
        },
      );

      uploadStream.end(fileBuffer);
    });
  }

  async deleteImage(publicId: string): Promise<boolean> {
    try {
      const result: any = await cloudinary.uploader.destroy(publicId);
      return result.result === 'ok';
    } catch (error: any) {
      throw new Error(`Delete from Cloudinary failed: ${error.message}`);
    }
  }

  async deleteImageByUrl(imageUrl: string): Promise<boolean> {
    try {
      const publicId = this.extractPublicIdFromUrl(imageUrl);
      return await this.deleteImage(publicId);
    } catch (error: any) {
      throw new Error(`Delete from Cloudinary failed: ${error.message}`);
    }
  }

  private extractPublicIdFromUrl(url: string): string {
    const matches = url.match(
      /\/upload\/(?:v\d+\/)?(.+)\.(?:jpg|jpeg|png|gif|webp)/i,
    );

    if (!matches || matches.length < 2) {
      throw new Error('Invalid Cloudinary URL');
    }

    return matches[1].replace(/\.[^/.]+$/, '');
  }
}

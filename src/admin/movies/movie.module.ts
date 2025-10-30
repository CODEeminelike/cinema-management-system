import { PrismaModule } from '../../sys/prisma/prisma.module'; // ← SỬA THÀNH ../../
import { MoviesController } from './movie.controller';
import { MoviesService } from './movie.service';
import { Module } from '@nestjs/common';
import { CloudinaryModule } from '../../sys/cloudinary/cloudinary.module'; // ← SỬA THÀNH ../../

@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}

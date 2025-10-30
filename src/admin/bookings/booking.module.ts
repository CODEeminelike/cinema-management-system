import { Module } from '@nestjs/common';
import { BookingsController } from './booking.controller';
import { BookingsService } from './booking.service';
import { PrismaModule } from '../../sys/prisma/prisma.module'; // ← SỬA THÀNH ../../

@Module({
  imports: [PrismaModule],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}

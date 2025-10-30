import { Module } from '@nestjs/common';
import { BookingsController } from './booking.controller';

import { PrismaModule } from '../../sys/prisma/prisma.module'; // ← SỬA THÀNH ../../
import { BookingsService } from './booking.service';

@Module({
  imports: [PrismaModule],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}

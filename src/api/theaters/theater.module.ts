import { Module } from '@nestjs/common';
import { TheaterController } from './theater.controller';
import { GuardModule } from '../../shared/guards/guard.module';
import { PrismaModule } from '../../sys/prisma/prisma.module';
import { TheaterService } from './theater.service';

@Module({
  imports: [GuardModule, PrismaModule],
  controllers: [TheaterController],
  exports: [],
  providers: [TheaterService],
})
export class TheaterModule {}

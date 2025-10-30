import { Module } from '@nestjs/common';
import { GuardModule } from '../../shared/guards/guard.module'; // ← SỬA THÀNH ../../
import { PrismaModule } from '../../sys/prisma/prisma.module'; // ← SỬA THÀNH ../../
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';

@Module({
  imports: [GuardModule, PrismaModule],
  controllers: [MovieController],
  exports: [],
  providers: [MovieService],
})
export class MovieModule {}

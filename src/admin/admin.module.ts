import { Module } from '@nestjs/common';
// Để sử dụng guards
import { TokenModule } from 'sys/token/token.mudule';
import { PrismaModule } from 'sys/prisma/prisma.module';
import { GuardModule } from 'shared/guards/guard.module';
import { UsersModule } from './users/user.module';
import { MoviesModule } from './movies/movie.module';
import { BookingsModule } from './bookings/booking.module';

@Module({
  imports: [
    PrismaModule,
    TokenModule,
    GuardModule,
    UsersModule,
    MoviesModule,
    BookingsModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AdminModule {}

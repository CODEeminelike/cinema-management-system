import { Module } from '@nestjs/common';

import { TheaterModule } from './theaters/theater.module';
import { UsersModule } from './users/user.module';
import { MovieModule } from './movies/movie.module';
import { BookingsModule } from './bookings/booking.module';

@Module({
  imports: [TheaterModule, UsersModule, MovieModule, BookingsModule],
  controllers: [],
  exports: [],
})
export class ApiModule {}

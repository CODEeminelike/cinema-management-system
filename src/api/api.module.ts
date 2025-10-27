import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { TheaterModule } from './theaters/theater.module';
import { UsersModule } from './users/user.module';

@Module({
  imports: [TheaterModule, UsersModule],
  controllers: [ApiController],
  exports: [],
})
export class ApiModule {}
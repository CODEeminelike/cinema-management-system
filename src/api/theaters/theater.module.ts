import { Module } from '@nestjs/common';
import { TheaterController } from './theater.controller';
import { GuardModule } from 'shared/guards/guard.module';

@Module({
  imports: [GuardModule],
  controllers: [TheaterController],
  exports: [],
})
export class TheaterModule {}

import { Module } from '@nestjs/common';
// Để sử dụng guards
import { TokenModule } from 'sys/token/token.mudule';
import { PrismaModule } from 'sys/prisma/prisma.module';
import { GuardModule } from 'shared/guards/guard.module';
import { UsersModule } from './users/user.module';

@Module({
  imports: [PrismaModule, TokenModule, GuardModule, UsersModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AdminModule {}

import { Module } from '@nestjs/common';
import { UsersController } from './user.controller';

import { UsersService } from './user.service';
import { TokenModule } from 'sys/token/token.mudule';
import { PrismaModule } from 'sys/prisma/prisma.module';
import { GuardModule } from 'shared/guards/guard.module';

@Module({
  imports: [TokenModule, PrismaModule, GuardModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}

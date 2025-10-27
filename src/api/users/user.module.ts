import { Module } from '@nestjs/common';
import { UsersController } from './user.controller';

import { UsersService } from './user.service';
import { TokenModule } from 'sys/token/token.mudule';
import { PrismaModule } from 'sys/prisma/prisma.module';

@Module({
  imports: [TokenModule,PrismaModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
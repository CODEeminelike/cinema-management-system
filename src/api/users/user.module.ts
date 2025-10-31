import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { TokenModule } from '../../sys/token/token.module';
import { PrismaModule } from '../../sys/prisma/prisma.module';
import { GuardModule } from '../../shared/guards/guard.module';
import { TokenCookieMiddleware } from '../../shared/middlewares/token-cookie.middleware';

@Module({
  imports: [TokenModule, PrismaModule, GuardModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { TokenModule } from '../../sys/token/token.module'; // ← SỬA THÀNH ../../
import { PrismaModule } from '../../sys/prisma/prisma.module'; // ← SỬA THÀNH ../../
import { GuardModule } from '../../shared/guards/guard.module'; // ← SỬA THÀNH ../../
import { TokenCookieMiddleware } from '../../shared/middlewares/token-cookie.middleware'; // ← SỬA THÀNH ../../

@Module({
  imports: [TokenModule, PrismaModule, GuardModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}

// src/admin/users/users.module.ts
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersService } from './user.service';
import { PrismaModule } from '../../sys/prisma/prisma.module'; // Import từ sys/prisma
import { GuardModule } from '../../shared/guards/guard.module'; // Để sử dụng guards
import { TokenModule } from '../../sys/token/token.module'; // ← SỬA THÀNH ../../
import { UsersController } from './user.controller';
import { TokenCookieMiddleware } from '../../shared/middlewares/token-cookie.middleware'; // ← SỬA THÀNH ../../

@Module({
  imports: [PrismaModule, TokenModule, GuardModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { Logger } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    this.logger.log('Checking roles for access');

    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [
        context.getHandler(), // Kiểm tra ở method level
        context.getClass(), // Kiểm tra ở class level
      ],
    );

    if (!requiredRoles) {
      return true; // Không yêu cầu role cụ thể, cho phép (public)
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.role) {
      this.logger.warn('No user or role found in request');
      throw new ForbiddenException('Không có quyền truy cập');
    }

    const hasRole = requiredRoles.includes(user.role);
    if (!hasRole) {
      this.logger.warn(
        `User role ${user.role} does not match required roles: ${requiredRoles.join(', ')}`,
      );
      throw new ForbiddenException('Vai trò không phù hợp');
    }

    this.logger.log(`Access granted for role: ${user.role}`);
    return true;
  }
}

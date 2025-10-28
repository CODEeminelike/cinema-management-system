import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext) {
    this.logger.log('Checking JWT authentication');
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      this.logger.warn(
        `Authentication failed: ${info?.message || err?.message}`,
      );
      throw err || new UnauthorizedException('Không được phép truy cập');
    }
    this.logger.log(`Authenticated user: ${user.userId}`);
    return user;
  }
}

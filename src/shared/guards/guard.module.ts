import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [AuthModule, RolesModule],
  exports: [AuthModule, RolesModule],
})
export class GuardModule {}

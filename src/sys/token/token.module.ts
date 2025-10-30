import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { TokenService } from './token.service';

@Module({
  imports: [
    ConfigModule.forRoot(), // Load .env file
    JwtModule.register({}),
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}

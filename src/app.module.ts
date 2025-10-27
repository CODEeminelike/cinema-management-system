import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiModule } from 'api/api.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true, // Làm ConfigModule toàn cục
    }),
    ApiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

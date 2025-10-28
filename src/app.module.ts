import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AdminModule } from 'admin/admin.module';
import { ApiModule } from 'api/api.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true, // Làm ConfigModule toàn cục
    }),
    ApiModule,
    AdminModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

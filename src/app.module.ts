import { Module } from '@nestjs/common';


import { ApiModule } from 'api/api.module';
import { SharedModule } from 'shared/shared.module';
import { SysModule } from 'sys/sys.module';

@Module({
  imports: [ApiModule,SharedModule,SysModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

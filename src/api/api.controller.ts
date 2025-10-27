import { Controller, Get } from '@nestjs/common';
import { APP_CONSTANTS } from 'shared/constant/app.constant';


@Controller("api")
export class ApiController {
  @Get()
  getApiInfo() {
    return {
      message: 'Welcome to Movie API',
      basePath: APP_CONSTANTS.API_PREFIX,
      port: APP_CONSTANTS.PORT,
      status: 'running',
    };
  }
}
// src/sys/config/config.service.ts
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class ConfigService {
  getApiPrefix(): string {
    return process.env.API_PREFIX || '/api';
  }
}
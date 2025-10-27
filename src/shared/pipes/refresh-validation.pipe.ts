// src/shared/pipes/refresh-validation.pipe.ts
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { RefreshTokenDto } from '../../api/users/dto/refresh-token.dto';

@Injectable()
export class RefreshValidationPipe implements PipeTransform {
  async transform(value: any) {
    if (!value || typeof value !== 'object' || !value.refreshToken) {
      throw new BadRequestException(
        'Invalid request body: refreshToken is required',
      );
    }

    // Ép refreshToken thành chuỗi
    value.refreshToken = String(value.refreshToken);

    const refreshDto = plainToInstance(RefreshTokenDto, value);

    const errors = await validate(refreshDto);
    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: errors
          .map((err) => Object.values(err.constraints || {}))
          .flat(),
      });
    }

    return refreshDto;
  }
}

import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { LoginDto } from '../../api/users/dto/login.dto';

@Injectable()
export class LoginValidationPipe implements PipeTransform {
  async transform(value: any) {
    const loginDto = plainToInstance(LoginDto, value);
    const errors = await validate(loginDto);

    if (errors.length > 0) {
      const messages = errors
        .map((err) => {
          if (err.constraints) {
            return Object.values(err.constraints);
          }
          return [];
        })
        .flat();
      
      throw new BadRequestException(['Invalid input', ...messages]);
    }

    return loginDto;
  }
}
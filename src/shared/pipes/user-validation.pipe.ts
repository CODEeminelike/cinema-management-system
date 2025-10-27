import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateUserDto } from '../../api/users/dto/create-user.dto';

@Injectable()
export class UserValidationPipe implements PipeTransform {
  async transform(value: any) {
    const userDto = plainToInstance(CreateUserDto, value);
    const errors = await validate(userDto);

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

    return userDto;
  }
}

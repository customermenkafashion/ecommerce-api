import {
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';

export class AppValidationPipe extends ValidationPipe {
  constructor() {
    super({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const formattedErrors: Record<string, string> = {};

        errors.forEach((err) => {
          // ✅ SAFETY CHECK
          if (err.constraints) {
            const message = Object.values(err.constraints)[0];
            formattedErrors[err.property] = message;
          }
        });

        return new BadRequestException({
          statusCode: 400,
          error: 'Bad Request',
          message: formattedErrors,
        });
      },
    });
  }
}

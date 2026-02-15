import { PipeTransform, BadRequestException } from '@nestjs/common';

export class ParseIdPipe implements PipeTransform {
  transform(value: string) {
    const id = Number(value);
    if (isNaN(id)) {
      throw new BadRequestException('Invalid ID');
    }
    return id;
  }
}

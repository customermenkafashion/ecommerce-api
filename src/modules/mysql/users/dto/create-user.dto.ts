import { IsEmail, IsNotEmpty } from 'class-validator';
import { IsFieldExist } from '../../../../common/validators/is-field-exist.decorator';
import { UsersService } from '../users.service';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsEmail({}, { message: 'Email must be valid' })
  @IsFieldExist({ entity: UsersService, field: 'email' }, { message: 'Email already exists' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}

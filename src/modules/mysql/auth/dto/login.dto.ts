import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { IsFieldExist } from '../../../../common/validators/is-field-exist.decorator';
import { UsersService } from '../../users/users.service';

export class LoginDto {
  @IsEmail({}, { message: 'Email must be valid' })
   @IsFieldExist({ entity: UsersService, field: 'email', not: true }, { message: 'Email does not exists' }) // not: true means opposite result of exist
   email: string;
 
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}

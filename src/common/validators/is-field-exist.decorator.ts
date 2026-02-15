// src/common/validators/is-field-exist.decorator.ts
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';

export interface FieldExistOptions {
  entity: any;   // UsersService (class) or other service class
  field: string;
  not?: boolean; // optional, flip result if true
}

@ValidatorConstraint({ async: true })
@Injectable()
export class IsFieldExistConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly moduleRef: ModuleRef) {}

  async validate(value: any, args: ValidationArguments) {
    const { entity, field, not } = args.constraints[0];

    //  console.log("field",field);
    //  console.log("value",value);
    //  console.log("args",args);

    if (!value) return true;

    // 🔥 THIS IS THE KEY LINE
    const serviceInstance = this.moduleRef.get(entity, {
      strict: false,
    });

    if (!serviceInstance?.findOneByField) {
      throw new Error(
        `${entity.name} must implement findOneByField()`,
      );
    }

    const result = await serviceInstance.findOneByField(field, value);
    if(not == true && not != undefined){
      return result ? result : !result;
    }else{
      return !result;
    }
   
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.constraints[0].field} already exists`;
  }
}

export function IsFieldExist(
  options: FieldExistOptions,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      constraints: [options],
      options: validationOptions,
      validator: IsFieldExistConstraint,
    });
  };
}


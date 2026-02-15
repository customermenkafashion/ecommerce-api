import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsImageFileConstraint implements ValidatorConstraintInterface {
  validate(file: any, args: ValidationArguments) {
    if (!file) return false; // file is required
    // check MIME type
    return ['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype);
  }

  defaultMessage(args: ValidationArguments) {
    return 'profile_image must be a valid image file (jpg, jpeg, png)';
  }
}

export function IsImageFile(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    console.log("ddddddddkkkkkkkkkkkkk");
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsImageFileConstraint,
    });
  };
}

import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsUniqueConstraint } from '../validator/is-unique.constraint';

export function IsUnique(
  entityClass: any,
  column: string,
  validationOptions?: ValidationOptions,
  ignoreId?: string,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [entityClass, column, ignoreId],
      validator: IsUniqueConstraint,
    });
  };
}

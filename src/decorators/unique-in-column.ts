import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { AppDataSource } from '../data-source';

@ValidatorConstraint({ async: true })
export class EntityAlreadyExistsConstraint implements ValidatorConstraintInterface {
  async validate(property: unknown) {
    if (typeof property !== 'string') {
      return false;
    }
    const repo = AppDataSource().getRepository(typeof property);
    const entity = await repo.findOne({ where: { property } });
    return !entity;
  }
}

export function UniqueInColumn(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: EntityAlreadyExistsConstraint,
    });
  };
}
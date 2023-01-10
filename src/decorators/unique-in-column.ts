import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { User } from '../entities/user';
import { AppDataSource } from '../lib/typeorm';

@ValidatorConstraint({ async: true })
export class EntityAlreadyExistsConstraint implements ValidatorConstraintInterface {
  async validate(value: unknown) {
    if (typeof value !== 'string') {
      return false;
    }
    const repo = AppDataSource.getRepository(User);
    const entity = await repo.findOne({ where: { email: value } });
    return !entity;
  }

  defaultMessage() {
    return 'email already exists';
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
      validator: EntityAlreadyExistsConstraint
    });
  };
}
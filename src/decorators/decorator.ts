import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";
import { AppDataSource } from "../data-source";

export function UniqueInColumn(property: string, validationOptions?: ValidationOptions) {
    return function (object: Record<string, unknown>, propertyName: string, caseSensitive: string) {
      registerDecorator({
        name: 'UniqueInColumn',
        target: object.constructor,
        propertyName: propertyName,
        constraints: [property],
        options: validationOptions,
        validator: {
          async validate(value: any, args: ValidationArguments) {
            const repo = AppDataSource().getRepository(typeof object);
            const entity = await repo.findOne({ where: { [property]: caseSensitive ? value : value.toString().toLower() } });
            return entity === undefined;
           },
        },
      });
    };
  }
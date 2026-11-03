import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsFilterValue(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsFilterValue',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          if (typeof value === 'string' || typeof value === 'boolean') {
            return true;
          }

          if (Array.isArray(value) && value.every((v) => typeof v === 'string')) {
            return true;
          }

          if (
            typeof value === 'object' &&
            value !== null &&
            'from' in value &&
            'to' in value &&
            typeof value.from === 'string' &&
            typeof value.to === 'string' &&
            Object.keys(value).length === 2
          ) {
            return true;
          }

          if (
            typeof value === 'object' &&
            value !== null &&
            'include' in value &&
            'exclude' in value &&
            Array.isArray(value.include) &&
            Array.isArray(value.exclude) &&
            value.include.every((v) => 
              typeof v === 'string' || 
              (typeof v === 'object' && v !== null && 'id' in v && 'title' in v && typeof v.id === 'string' && typeof v.title === 'string')
            ) &&
            value.exclude.every((v) => 
              typeof v === 'string' || 
              (typeof v === 'object' && v !== null && 'id' in v && 'title' in v && typeof v.id === 'string' && typeof v.title === 'string')
            ) &&
            Object.keys(value).length === 2
          ) {
            return true;
          }

          return false;
        },
        defaultMessage() {
          return `Value must be a string, boolean, string[], { from: string, to: string }, { include: (string[] | { id: string, title: string }[]), exclude: (string[] | { id: string, title: string }[]) }}`;
        },
      },
    });
  };
}

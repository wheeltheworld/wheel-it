import { Entity as TypeEntity, EntityOptions } from "typeorm";

export const Entity =
  (
    nameOrOptions?: EntityOptions | string,
    options?: EntityOptions
  ): ClassDecorator =>
  (ctr) => {
    ctr.prototype.wheel = true;
    ctr.prototype.editables ??= [];
    TypeEntity(nameOrOptions as string, options)(ctr);
  };

export const Editable = (): PropertyDecorator => (target: any, propertyKey) => {
  target.constructor.prototype.editables ??= [];
  target.constructor.prototype.editables.push(propertyKey);
};

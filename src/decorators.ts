import { Entity as TypeEntity, EntityOptions } from "typeorm";

export const Entity =
  (
    nameOrOptions?: EntityOptions | string,
    options?: EntityOptions
  ): ClassDecorator =>
  (ctr) => {
    ctr.prototype.wheel ??= {};
    TypeEntity(nameOrOptions as string, options)(ctr);
  };

export const createRegistableDecorator =
  (name: string) => (): PropertyDecorator => (target: any, propertyKey) => {
    target.constructor.prototype.wheel ??= {};
    target.constructor.prototype.wheel[name] ??= [];
    target.constructor.prototype.wheel[name].push(propertyKey);
  };

export const Editable = createRegistableDecorator("editables");

export const GetableBy = createRegistableDecorator("getables");

export const Sortable = createRegistableDecorator("sortables");

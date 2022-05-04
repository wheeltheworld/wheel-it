import { Entity as TypeEntity, EntityOptions } from "typeorm";

export const Entity =
  (
    nameOrOptions?: EntityOptions | string,
    options?: EntityOptions
  ): ClassDecorator =>
  (ctr) => {
    ctr.prototype.wheel ??= {
      isOkay: true,
      editables: [],
      getables: [],
      sortables: [],
      hiddens: [],
    };

    ctr.prototype.wheel.isOkay ??= true;
    ctr.prototype.wheel.editables ??= [];
    ctr.prototype.wheel.getables ??= [];
    ctr.prototype.wheel.sortables ??= [];
    ctr.prototype.wheel.hiddens ??= [];

    ctr.prototype.hideHiddens = function () {
      for (const hidden of this.wheel.hiddens) {
        delete this[hidden];
      }
    };

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

export const Hidden = createRegistableDecorator("hiddens");

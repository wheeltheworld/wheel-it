import { Entity, EntityOptions } from "typeorm";

export const WheelEntity =
  (options?: EntityOptions): ClassDecorator =>
  (ctr) => {
    ctr.prototype.wheel = true;
    Entity(options)(ctr);
  };

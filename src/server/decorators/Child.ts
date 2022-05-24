import type { BaseEntity } from "typeorm";
import type { CrudModel } from "../genCrud";

export interface ChildConfig<T extends abstract new () => object> {
  name: string;
  label: string;
  relatedBy: string;
  target: () => typeof CrudModel;
  toString: (a: InstanceType<T>) => string;
}

export const Child =
  <T extends typeof BaseEntity>(
    child: () => T,
    config: Partial<Exclude<ChildConfig<T>, "target">> = {}
  ): PropertyDecorator =>
  (target: any, propertyKey) => {
    if (typeof propertyKey !== "string") return;
    target.constructor.wheel ??= {};
    target.constructor.wheel.children ??= [];
    completeChild(
      config,
      propertyKey,
      child as unknown as () => typeof CrudModel
    );
    target.constructor.wheel.children.push(config);
  };

export const completeChild = (
  child: Partial<ChildConfig<any>>,
  propertyKey: string,
  target: () => typeof CrudModel
) => {
  child.name ??= propertyKey;
  child.label ??= propertyKey;
  child.relatedBy ??= "id";
  child.toString ??= (data) => JSON.stringify(data);
  child.target = target;
  return child;
};

import type { BaseEntity } from "typeorm";
import type { Relation } from "../../shared/manifest";
import type { CrudModel } from "../genCrud";

export interface ChildConfig<T extends abstract new () => any> {
  name: string;
  label: string;
  relatedBy: string;
  target: () => typeof CrudModel;
  toString: (a: InstanceType<T>) => string;
  type: Relation;
}

const Relation =
  (type: Relation) =>
  <T extends typeof BaseEntity>(
    child: () => T,
    config: Partial<Omit<ChildConfig<T>, "target" | "many">> = {}
  ): PropertyDecorator =>
  (target: any, propertyKey) => {
    if (typeof propertyKey !== "string") return;
    target.constructor.wheel ??= {};
    target.constructor.wheel.relations ??= [];
    completeRelation(
      config,
      propertyKey,
      child as unknown as () => typeof CrudModel,
      type
    );
    target.constructor.wheel.relations.push(config);
  };

export const RelatesToOne = Relation("relatesToOne");
export const RelatesToMany = Relation("relatesToMany");
export const OwnsOne = Relation("ownsOne");
export const OwnsMany = Relation("ownsMany");

export const completeRelation = (
  child: Partial<ChildConfig<any>>,
  propertyKey: string,
  target: () => typeof CrudModel,
  type: Relation
) => {
  child.name ??= propertyKey;
  child.label ??= propertyKey;
  child.relatedBy ??= "id";
  child.toString ??= (data) => JSON.stringify(data);
  child.target = target;
  child.type = type;
  return child;
};

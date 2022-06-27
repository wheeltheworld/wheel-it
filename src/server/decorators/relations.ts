import type { BaseEntity } from "typeorm";
import type { Relation } from "../../shared/manifest";
import type { CrudModel } from "../genCrud";

export interface ChildConfig<T extends abstract new () => any> {
  /**
   * Position of the field in the columns
   */
  position: number;
  /**
   * Label for the field
   */
  label: string;
  /**
   * Name of the field
   */
  name: string;
  /**
   * Type of the field, can be a custom type or one of the following:
   * int, float, string, date, boolean
   *
   * Custom types should be handled manually
   */
  type: Relation;
  /**
   * If the field is required
   * @default {false}
   */
  isRequired: boolean;
  /**
   * Can this field be edited by the client
   * @default {false}
   */
  isReadonly: boolean;
  /**
   * Hidden fields are never exposed to the client
   * @default {false}
   */
  isHidden: boolean;
  /**
   * Is this field showable in the list view
   * @default {true}
   */
  isListable: boolean;
  /**
   * Is this field showable in the preview view
   * @default {true}
   */
  isPreviewable: boolean;
  /**
   * Can this field be searched by the client
   * @default {false}
   */
  isSearchable: boolean;
  /**
   * An indexable field can be used
   * to select a single record,
   * usually used for ids and slugs
   * @default {false}
   */
  indexable: boolean;
  showInForm: boolean;

  relatedBy: string;
  relationName: string;
  target: () => typeof CrudModel;
  toString: (a: InstanceType<T>) => string;
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
  child.position ??= 0;
  child.isHidden ??= false;
  child.isReadonly ??= false;
  child.isListable ??= true;
  child.isPreviewable ??= true;
  child.isRequired ??= true;
  child.isSearchable ??= false;
  child.indexable ??= false;
  child.showInForm ??= true;
  child.name ??= propertyKey;
  child.label ??= propertyKey;
  child.relatedBy ??= "id";
  child.toString ??= (data) => JSON.stringify(data);
  child.target = target;
  child.type = type;
  return child;
};

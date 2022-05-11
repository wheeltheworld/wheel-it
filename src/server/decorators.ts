import type { Field as IField } from "../shared/manifest";
import { completeField } from "./utils/getField";

export const Form =
  (): ClassDecorator =>
  (ctr: Function & { wheel?: { isOkay: true; fields: IField[] } }) => {
    ctr.wheel ??= {
      isOkay: true,
      fields: [],
    };

    ctr.wheel.isOkay ??= true;
    ctr.wheel.fields ??= [];

    ctr.prototype.hideHiddens = function () {
      const hiddens = this.constructor.wheel.fields
        .filter((f: IField) => f.isHidden)
        .map((f: IField) => f.name);

      for (const hidden of hiddens) {
        delete this[hidden];
      }
    };
  };

export const Field =
  (f: Partial<IField> = {}): PropertyDecorator =>
  (target: any, propertyKey) => {
    if (typeof propertyKey !== "string") return;
    target.constructor.wheel ??= {};
    target.constructor.wheel.fields ??= [];
    completeField(f, propertyKey, target.constructor);
    target.constructor.wheel.fields.push(f);
  };

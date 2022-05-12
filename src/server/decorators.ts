import type { Field as IField } from "../shared/manifest";
import type { Wheel } from "./genCrud";
import { completeField } from "./utils/completeField";

interface FormConfig {
  icon?: string;
}

export const Form =
  (config?: FormConfig): ClassDecorator =>
  (ctr: Function & { wheel?: Wheel }) => {
    ctr.wheel ??= {
      isOkay: true,
      fields: [],
      icon: config?.icon,
    };

    ctr.wheel.isOkay ??= true;
    ctr.wheel.fields ??= [];
    ctr.wheel.icon ??= config?.icon;

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

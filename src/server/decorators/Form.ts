import type { Field as IField } from "../../shared/manifest";
import type { Wheel } from "../genCrud";

interface FormConfig {
  icon?: string;
  label?: string;
}

export const Form =
  (config?: FormConfig): ClassDecorator =>
  (ctr: Function & { wheel?: Omit<Wheel, "manifest"> }) => {
    ctr.wheel ??= {
      isOkay: true,
      fields: [],
      icon: config?.icon,
      children: [],
      label: config?.label,
    };

    ctr.wheel.isOkay ??= true;
    ctr.wheel.fields ??= [];
    ctr.wheel.icon ??= config?.icon;
    ctr.wheel.children ??= [];
    ctr.wheel.label ??= config?.label;

    ctr.prototype.hideHiddens = function () {
      const hiddens = this.constructor.wheel.fields
        .filter((f: IField) => f.isHidden)
        .map((f: IField) => f.name);

      for (const hidden of hiddens) {
        delete this[hidden];
      }
    };
  };

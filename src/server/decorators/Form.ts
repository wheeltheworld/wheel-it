import type { Field as IField } from "../../shared/manifest";
import type { Wheel } from "../genCrud";

interface FormConfig {
  icon?: string;
  label?: string;
  isAutonomous?: boolean;
}

export const Form =
  (config?: FormConfig): ClassDecorator =>
  (ctr: Function & { wheel?: Omit<Wheel, "manifest"> }) => {
    ctr.wheel ??= {
      isOkay: true,
      isAutonomous: config?.isAutonomous ?? true,
      fields: [],
      icon: config?.icon,
      relations: [],
      label: config?.label,
    };

    ctr.wheel.isAutonomous ??= config?.isAutonomous ?? true;
    ctr.wheel.isOkay ??= true;
    ctr.wheel.fields ??= [];
    ctr.wheel.icon ??= config?.icon;
    ctr.wheel.relations ??= [];
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

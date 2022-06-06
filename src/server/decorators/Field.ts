import type { Field as IField } from "../../shared/manifest";

export const Field =
  (f: Partial<IField> = {}): PropertyDecorator =>
  (target: any, propertyKey) => {
    if (typeof propertyKey !== "string") return;
    target.constructor.wheel ??= {};
    target.constructor.wheel.fields ??= [];
    completeField(f, propertyKey);
    target.constructor.wheel.fields.push(f);
  };

export const completeField = (field: Partial<IField>, propName: string) => {
  field.isHidden ??= false;
  field.isReadonly ??= false;
  field.isListable ??= true;
  field.isPreviewable ??= true;
  field.isRequired ??= false;
  field.isSearchable ??= false;
  field.indexable ??= false;
  field.label ??= propName;
  field.name ??= propName;
  field.type ??= "string";
  if (field.type === "select" || field.type === "multiselect") {
    field.options ??= [];
  }
  return field;
};

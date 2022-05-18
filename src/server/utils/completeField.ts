import type { Field } from "../../shared/manifest";

export const completeField = (field: Partial<Field>, propName: string) => {
  field.isHidden ??= false;
  field.isReadonly ??= false;
  field.isListable ??= true;
  field.isRequired ??= false;
  field.isSearchable ??= false;
  field.indexable ??= false;
  field.label ??= propName;
  field.name ??= propName;
  field.type ??= "string";
  return field;
};

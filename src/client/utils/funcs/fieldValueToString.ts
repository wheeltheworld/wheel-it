import type { Field } from "../../../shared/manifest";

export const fieldValueToString = (field: Field, value: any) => {
  if (field.type === "date") {
    value = `${value.day}/${value.month}/${value.year}`;
  }
  if (field.type === "select") {
    value = field.options.find((o) => o.value === value)?.label;
  }
  if (field.type === "multiselect") {
    value = value
      .map((v: string) => field.options.find((o) => o.value === v)?.label)
      .join(", ");
  }
  value = value?.toString();
  return value;
};

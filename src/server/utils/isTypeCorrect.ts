import type { Field } from "../../shared/manifest";
import { isNullOrUndefined } from "./isNullOrUndefined";

export const isTypeCorrect = (value: any, field: Field): boolean => {
  if (!field.isRequired && isNullOrUndefined(value)) return true;
  switch (field.type) {
    case "string":
      return typeof value === "string";
    case "int":
      return typeof value === "number" && value % 1 === 0;
    case "float":
      return typeof value === "number";
    case "boolean":
      return typeof value === "boolean";
    case "date":
      return typeof value === "string" && isValidDate(value);
    case "select":
      return (
        typeof value === "string" &&
        field.options.map((o) => o.value).includes(value)
      );
    case "multiselect":
      return (
        Array.isArray(value) &&
        value.every((v) => field.options.map((o) => o.value).includes(v))
      );
    default:
      return false;
  }
};

const isValidDate = (date: string) => {
  return (
    new Date(date).toString() !== "Invalid Date" &&
    !isNaN(new Date(date).valueOf())
  );
};

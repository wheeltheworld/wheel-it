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
    case "email":
      return typeof value === "string" && isValidEmail(value);
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

const isValidEmail = (email: string) => {
  return Boolean(email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  ));
};

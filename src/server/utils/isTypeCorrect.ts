import type { Field } from "../../shared/manifest";

export const isTypeCorrect = (value: any, field: Field): boolean => {
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

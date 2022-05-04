import type { CrudModel } from "./genCrud";
import { columnTypeToFieldType } from "./utils/columnTypeToFieldType";

export interface Field {
  name: string;
  type: string;
}

export const getFields = (
  model: typeof CrudModel,
  only?: "editables" | "getables"
): Field[] => {
  const fields = model.getRepository().metadata.columns.map((column) => ({
    name: column.propertyName,
    columnType: column.type.toString(),
    type: columnTypeToFieldType(column.type),
  }));
  if (!only) {
    return fields;
  }
  return fields.filter((field) =>
    model.prototype.wheel[only].includes(field.name)
  );
};

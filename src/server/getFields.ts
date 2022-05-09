import type { Field } from "src/shared/manifest";
import type { CrudModel } from "./genCrud";
import { columnTypeToFieldType } from "./utils/columnTypeToFieldType";

export const getFields = (model: typeof CrudModel): Field[] => {
  const fields: Field[] = model
    .getRepository()
    .metadata.columns.map((column) => ({
      name: column.propertyName,
      columnType: column.type.toString(),
      type: columnTypeToFieldType(column.type),
      editable: model.prototype.wheel.editables.includes(column.propertyName),
      label: column.propertyName,
      required: column.isNullable === false,
    }));

  return fields;
};

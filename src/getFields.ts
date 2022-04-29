import type { BaseEntity } from "typeorm";
import { columnTypeToFieldType } from "./utils/columnTypeToFieldType";

export interface Field {
  name: string;
  type: string;
}

export const getFields = (entity: typeof BaseEntity): Field[] => {
  return entity.getRepository().metadata.columns.map((column) => ({
    name: column.propertyName,
    columnType: column.type.toString(),
    type: columnTypeToFieldType(column.type),
  }));
};

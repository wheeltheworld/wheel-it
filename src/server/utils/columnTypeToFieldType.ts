import { Field } from "../../shared/fields";
import type { ColumnType } from "typeorm";

export const columnTypeToFieldType = (columnType: ColumnType): string => {
  const columnTypeToFieldTypeMap: Partial<Record<string, Field>> = {
    int: Field.INT,
    bigint: Field.INT,
    decimal: Field.FLOAT,
    float: Field.FLOAT,
    double: Field.FLOAT,
    varchar: Field.STRING,
    text: Field.STRING,
    bool: Field.BOOLEAN,
    tinyint: Field.BOOLEAN,
  };
  return columnTypeToFieldTypeMap[columnType.toString()] || Field.STRING;
};

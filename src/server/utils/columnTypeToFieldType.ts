import type { ColumnType } from "typeorm";
import type { FieldType } from "../../shared/manifest";

export const columnTypeToFieldType = (
  columnType: ColumnType | undefined
): FieldType => {
  if (!columnType) return "string";
  const columnTypeToFieldTypeMap: Partial<Record<string, FieldType>> = {
    int: "int",
    bigint: "int",
    decimal: "float",
    float: "float",
    double: "float",
    varchar: "string",
    text: "string",
    bool: "boolean",
    tinyint: "boolean",
  };
  return columnTypeToFieldTypeMap[columnType.toString()] || "string";
};

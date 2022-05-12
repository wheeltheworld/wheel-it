import type { Field } from "../../shared/manifest";
import type { CrudModel } from "../genCrud";
import { columnTypeToFieldType } from "./columnTypeToFieldType";

export const completeField = (
  field: Partial<Field>,
  propName: string,
  model: typeof CrudModel
) => {
  try {
    field.isHidden ??= false;
    field.isReadonly ??= false;
    field.isListable ??= true;
    field.isRequired ??= false;
    field.isSearchable ??= false;
    field.indexable ??= false;
    field.label ??= propName;
    field.name ??= propName;
    const columns = model.getRepository().metadata.columns;
    field.type ??= columnTypeToFieldType(
      columns.find((c) => c.propertyName === propName)?.type
    );
  } catch (error) {
    setTimeout(() => {
      completeField(field, propName, model);
    }, 1000);
  }
  return field;
};

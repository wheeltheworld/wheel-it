import type { Field, ManifestRelation } from "../../../shared/manifest";

export enum VTSType {
  RelatesToOne = "relatesToOne",
  RelatesToMany = "relatesToMany",
  OwnsMany = "ownsMany",
  OwnsOne = "ownsOne",
  Date = "date",
  Select = "select",
  Multiselect = "multiselect",
}

export const fieldValueToString = (
  field: Field | ManifestRelation,
  value: any
) => {
  if (!field || !value) return value;
  switch (field.type) {
    case VTSType.RelatesToOne:
      value = value;
      break;
    case VTSType.RelatesToMany:
    case VTSType.OwnsMany:
      value = value;
      break;
    case VTSType.OwnsOne:
      value = value;
      break;
    case VTSType.Date:
      value = `${value.day}/${value.month}/${value.year}`;
      break;
    case VTSType.Select:
      value = field.options.find((o) => o.value === value)?.value;
      break;
    case VTSType.Multiselect:
      value = value
        .map((v: string) => field.options.find((o) => o.value === v)?.value)
        .join(", ");
      break;
    default:
      value = value;
      break;
  }
  return value.toString();
};

import type { Field, ManifestRelation } from "../../../shared/manifest";

export const fieldValueToString = (
  field: Field | ManifestRelation,
  value: any
) => {
  if (!field || !value) return value;
  switch (field.type) {
    case "relatesToOne":
      value = value;
      break;
    case "relatesToMany":
    case "ownsMany":
      value = value;
      break;
    case "ownsOne":
      value = value;
      break;
    case "date":
      value = `${value.day}/${value.month}/${value.year}`;
      break;
    case "select":
      value = field.options.find((o) => o.value === value)?.value;
      break;
    case "multiselect":
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

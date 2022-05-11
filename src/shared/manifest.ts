export interface Field {
  label: string;
  name: string;
  type: FieldType;
  isRequired: boolean;
  isReadonly: boolean;
  isHidden: boolean;
  indexable: boolean;
}

export type FieldType = "string" | "int" | "float" | "boolean" | "date";

export interface ManifestModel {
  name: string;
  icon?: string;
  fields: Field[];
  indexables: string[];
}

export interface ManifestModule {
  name: string;
  icon?: string;
  models: Record<string, ManifestModel>;
}

export interface Manifest {
  modules: Record<string, ManifestModule>;
}

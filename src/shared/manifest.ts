export interface Option {
  value: string;
  label: string;
}

export interface Field {
  /**
   * Label for the field
   */
  label: string;
  /**
   * Name of the field
   */
  name: string;
  /**
   * Type of the field, can be a custom type or one of the following:
   * int, float, string, date, boolean
   *
   * Custom types should be handled manually
   */
  type: FieldType;
  /**
   * If the field is required
   * @default {false}
   */
  isRequired: boolean;
  /**
   * Can this field be edited by the client
   * @default {false}
   */
  isReadonly: boolean;
  /**
   * Hidden fields are never exposed to the client
   * @default {false}
   */
  isHidden: boolean;
  /**
   * Is this field showable in the list view
   * @default {true}
   */
  isListable: boolean;
  /**
   * Can this field be searched by the client
   * @default {false}
   */
  isSearchable: boolean;
  /**
   * An indexable field can be used
   * to select a single record,
   * usually used for ids and slugs
   * @default {false}
   */
  indexable: boolean;

  /**
   * The default value for the field
   */
  default: any;

  /**
   * options for the field
   */
  options: Option[];
}

export type FieldType =
  | "string"
  | "int"
  | "float"
  | "boolean"
  | "date"
  | "select"
  | "multiselect";

export interface ManifestModel {
  name: string;
  icon?: string;
  fields: Record<"all" | "listables" | "indexables" | "searchables", Field[]>;
}

export interface ManifestModule {
  name: string;
  icon?: string;
  models: Record<string, ManifestModel>;
}

export interface Manifest {
  modules: Record<string, ManifestModule>;
}

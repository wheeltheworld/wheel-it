const relations = [
  "relatesToOne",
  "relatesToMany",
  "ownsOne",
  "ownsMany",
] as const;

export type Relation = typeof relations[number];

export interface Option {
  value: string;
  label: string;
}

export interface Field {
  /**
   * Position of the field in the columns
   */
  position: number;
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
   * Is this field showable in the preview view
   * @default {true}
   */
  isPreviewable: boolean;
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
  showInForm: boolean;

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
  | "email"
  | "date"
  | "select"
  | "multiselect";

export interface ManifestRelation {
  /**
   * Position of the field in the columns
   */
  position: number;
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
  type: Relation;
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
   * Is this field showable in the preview view
   * @default {true}
   */
  isPreviewable: boolean;
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
  showInForm: boolean;

  relatedBy: string;
  relationName: string;
}

export interface ManifestModel {
  name: string;
  label: string;
  icon?: string;
  fields: Record<
    "all" | "listables" | "indexables" | "searchables" | "previewables",
    Field[]
  >;
  relations: ManifestRelation[];
  isAutonomous?: boolean;
}

export interface ManifestModule {
  name: string;
  icon?: string;
  label: string;
  models: Record<string, ManifestModel>;
}

export interface Manifest {
  modules: Record<string, ManifestModule>;
}

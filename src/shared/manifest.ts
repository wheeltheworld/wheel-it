export interface Field {
  label: string;
  name: string;
  type: string;
  required: boolean;
  editable: boolean;
}

export interface ManifestModel {
  name: string;
  icon?: string;
  getables: string[];
  fields: Field[];
}

export interface ManifestModule {
  name: string;
  icon?: string;
  models: Record<string, ManifestModel>;
}

export interface Manifest {
  modules: Record<string, ManifestModule>;
}

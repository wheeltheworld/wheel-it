import type { Manifest, ManifestModule } from "../shared/manifest";
import type { Module } from "./genCrud";
import { modelName } from "./utils/modelName";

export const genManifest = (modules: Module[]): Manifest => {
  const manifest: Manifest = {
    modules: {},
  };

  for (const m of modules) {
    const mod: ManifestModule = {
      name: m.name,
      icon: m.icon,
      label: m.label || m.name,
      models: {},
    };
    for (const model of m.models) {
      mod.models[modelName(model)] = {
        name: modelName(model),
        label: model.wheel.label || modelName(model),
        isAutonomous: model.wheel.isAutonomous,
        icon: model.wheel.icon,
        fields: {
          all: model.wheel.fields,
          indexables: model.wheel.fields.filter((f) => f.indexable),
          listables: model.wheel.fields.filter(
            (f) => f.isListable && !f.isHidden
          ),
          searchables: model.wheel.fields.filter((f) => f.isSearchable),
          previewables: model.wheel.fields.filter((f) => f.isPreviewable),
        },
        relations: model.wheel.relations.map((r) => ({
          isHidden: r.isHidden,
          isReadonly: r.isReadonly,
          isListable: r.isListable,
          isPreviewable: r.isPreviewable,
          isRequired: r.isRequired,
          isSearchable: r.isSearchable,
          indexable: r.indexable,
          name: modelName(r.target()),
          relationName: r.name,
          label: r.label || r.name,
          relatedBy: r.relatedBy,
          type: r.type,
        })),
      };
      model.wheel.manifest = mod.models[modelName(model)];
    }
    manifest.modules[m.name] = mod;
  }

  return manifest;
};

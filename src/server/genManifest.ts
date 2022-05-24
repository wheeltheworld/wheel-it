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
        icon: model.wheel.icon,
        fields: {
          all: model.wheel.fields,
          indexables: model.wheel.fields.filter((f) => f.indexable),
          listables: model.wheel.fields.filter(
            (f) => f.isListable && !f.isHidden
          ),
          searchables: model.wheel.fields.filter((f) => f.isSearchable),
        },
        children: model.wheel.children.map((c) => ({
          name: c.name,
          label: c.label,
          relatedBy: c.relatedBy,
        })),
      };
      model.wheel.manifest = mod.models[modelName(model)];
    }
    manifest.modules[m.name] = mod;
  }

  return manifest;
};

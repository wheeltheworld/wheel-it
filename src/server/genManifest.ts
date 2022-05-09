import type { Manifest, ManifestModule } from "src/shared/manifest";
import type { Module } from "./genCrud";
import { getFields } from "./getFields";
import { modelName } from "./utils/modelName";

export const genManifest = (modules: Module[]): Manifest => {
  const manifest: Manifest = {
    modules: {},
  };

  for (const m of modules) {
    const mod: ManifestModule = {
      name: m.name,
      models: {},
    };
    for (const model of m.models) {
      mod.models[model.name] = {
        name: modelName(model),
        getables: model.prototype.wheel.getables,
        fields: getFields(model),
      };
    }
  }

  return manifest;
};

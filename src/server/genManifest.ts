import type { Manifest, ManifestModule } from "src/shared/manifest";
import type { Module } from "./genCrud";
import { getFields } from "./utils/getFields";
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
      mod.models[modelName(model)] = {
        name: modelName(model),
        getables: model.prototype.wheel.getables,
        fields: getFields(model),
      };
    }
    manifest.modules[m.name] = mod;
  }

  return manifest;
};

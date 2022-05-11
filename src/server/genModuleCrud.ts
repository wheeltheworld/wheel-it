import { RequestHandler, Router } from "express";
import type { ManifestModule } from "../shared/manifest";
import type { Module } from "./genCrud";
import { genModelCrud } from "./genModelCrud";
import { modelName } from "./utils/modelName";

export const genCrudModule = (
  mod: Module,
  manifest: ManifestModule
): RequestHandler => {
  const router = Router();
  for (const model of mod.models) {
    router.use(
      "/model",
      genModelCrud(model, manifest.models[modelName(model)])
    );
  }
  return Router().use(`/${manifest.name}`, router);
};

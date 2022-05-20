import { RequestHandler, Router } from "express";
import type { ManifestModule } from "../shared/manifest";
import type { Module } from "./genCrud";
import { genModelCrud } from "./genModelCrud";
import type { CTX } from "./utils/ctx";
import { modelName } from "./utils/modelName";

export const genCrudModule = (
  mod: Module,
  manifest: ManifestModule,
  ctx: CTX
): RequestHandler => {
  const router = Router();
  for (const model of mod.models) {
    router.use(
      "/model",
      genModelCrud(model, manifest.models[modelName(model)], ctx)
    );
  }
  return Router().use(`/${manifest.name}`, router);
};

import { RequestHandler, Router } from "express";
import type { ManifestModel } from "src/shared/manifest";
import { createEntity } from "./createEntity";
import { deleteEntity } from "./deleteEntity";
import type { CrudModel } from "./genCrud";
import { getEntity } from "./getEntity";
import { listEntity } from "./listEntity";
import { modelName } from "./utils/modelName";
import { updateEntity } from "./updateEntity";

export const genModelCrud = (
  model: typeof CrudModel,
  manifest: ManifestModel
): RequestHandler => {
  const router = Router();

  router.get("/", listEntity(model));
  router.post("/", createEntity(model));
  for (const getable of manifest.getables) {
    router.get(`/${getable}/:value`, getEntity(model, getable));
    router.patch(`/${getable}/:value`, updateEntity(model, getable));
    router.delete(`/${getable}/:value`, deleteEntity(model, getable));
  }

  return Router().use(`/${modelName(model)}`, router);
};

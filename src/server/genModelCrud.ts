import { RequestHandler, Router } from "express";
import type { ManifestModel } from "../shared/manifest";
import { createEntity } from "./controllers/createEntity";
import { deleteEntity } from "./controllers/deleteEntity";
import { listEntity } from "./controllers/listEntity";
import { updateEntity } from "./controllers/updateEntity";
import type { CrudModel } from "./genCrud";
import { getEntity } from "./controllers/getEntity";

export const genModelCrud = (
  model: typeof CrudModel,
  manifest: ManifestModel
): RequestHandler => {
  const router = Router();

  router.get("/", listEntity(model));
  router.post("/", createEntity(model));
  for (const indexable of manifest.indexables) {
    router.get(`/${indexable}/:value`, getEntity(model, indexable));
    router.patch(`/${indexable}/:value`, updateEntity(model, indexable));
    router.delete(`/${indexable}/:value`, deleteEntity(model, indexable));
  }

  return Router().use(`/${manifest.name}`, router);
};

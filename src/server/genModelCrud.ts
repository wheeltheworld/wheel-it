import { RequestHandler, Router } from "express";
import type { ManifestModel } from "src/shared/manifest";
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
  for (const getable of manifest.getables) {
    router.get(`/${getable}/:value`, getEntity(model, getable));
    router.patch(`/${getable}/:value`, updateEntity(model, getable));
    router.delete(`/${getable}/:value`, deleteEntity(model, getable));
  }

  return Router().use(`/${manifest.name}`, router);
};

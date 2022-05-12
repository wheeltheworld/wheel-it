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

  router.get("/", listEntity(model, manifest));
  router.post("/", createEntity(model, manifest));
  for (const indexable of manifest.fields.indexables) {
    router.get(`/${indexable.name}/:value`, getEntity(model, indexable.name));
    router.patch(
      `/${indexable.name}/:value`,
      updateEntity(model, indexable.name)
    );
    router.delete(
      `/${indexable.name}/:value`,
      deleteEntity(model, indexable.name)
    );
  }

  return Router().use(`/${manifest.name}`, router);
};

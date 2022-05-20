import { RequestHandler, Router } from "express";
import type { ManifestModel } from "../shared/manifest";
import { createEntity } from "./controllers/createEntity";
import { deleteEntity } from "./controllers/deleteEntity";
import { listEntity } from "./controllers/listEntity";
import { updateEntity } from "./controllers/updateEntity";
import type { CrudModel } from "./genCrud";
import { getEntity } from "./controllers/getEntity";
import type { CTX } from "./utils/ctx";

export const genModelCrud = (
  model: typeof CrudModel,
  manifest: ManifestModel,
  ctx: CTX
): RequestHandler => {
  const router = Router();

  router.get("/", listEntity(model, manifest, ctx));
  router.post("/", createEntity(model, manifest, ctx));
  for (const indexable of manifest.fields.indexables) {
    router.get(
      `/${indexable.name}/:value`,
      getEntity(model, manifest, indexable.name, ctx)
    );
    router.patch(
      `/${indexable.name}/:value`,
      updateEntity(model, manifest, indexable.name, ctx)
    );
    router.delete(
      `/${indexable.name}/:value`,
      deleteEntity(model, indexable.name)
    );
  }

  return Router().use(`/${manifest.name}`, router);
};

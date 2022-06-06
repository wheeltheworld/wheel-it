import { RequestHandler, Router } from "express";
import type { ManifestModel } from "../shared/manifest";
import type { CrudModel } from "./genCrud";
import type { CTX } from "./ctx";
import { getEntityHandler } from "./handlers/getEntity";
import { updateEntityHandler } from "./handlers/updateEntityHandler";
import { deleteEntityHandler } from "./handlers/deleteEntityHandler";
import { listEntityHandler } from "./handlers/listEntity";
import { createEntityHandler } from "./handlers/createEntityHandler";

export const genModelCrud = (
  model: typeof CrudModel,
  manifest: ManifestModel,
  ctx: CTX
): RequestHandler => {
  const router = Router();

  router.get("/", listEntityHandler(model, ctx));
  if (manifest.isAutonomous) {
    router.post("/", createEntityHandler(model, ctx));

    for (const indexable of manifest.fields.indexables) {
      if (indexable.name === "children") {
        throw new Error(
          "INVALID INDEXABLE KEY 'children', PLEASE CHANGE THE NAME OF THE FIELD"
        );
      }
      router.get(
        `/${indexable.name}/:value`,
        getEntityHandler(model, ctx, indexable.name)
      );
      router.patch(
        `/${indexable.name}/:value`,
        updateEntityHandler(model, ctx, indexable.name)
      );
      router.delete(
        `/${indexable.name}/:value`,
        deleteEntityHandler(model, ctx, indexable.name)
      );
    }
  }
  return Router().use(`/${manifest.name}`, router);
};

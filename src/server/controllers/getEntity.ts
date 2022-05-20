import type { RequestHandler } from "express";
import type { ManifestModel } from "../../shared/manifest";
import type { CrudModel } from "../genCrud";
import type { CTX } from "../utils/ctx";
import { unparseData } from "../utils/parseData";

export const getEntity =
  (
    model: typeof CrudModel,
    manifest: ManifestModel,
    key: string,
    ctx: CTX
  ): RequestHandler =>
  async (req, res) => {
    const entity = await model.findOne({
      where: { [key]: req.params.value },
    });
    if (!entity) {
      return res
        .status(404)
        .send(`${model.name} with ${key}: '${req.params.value}' not found`);
    }
    entity.hideHiddens();
    return res.json(unparseData(entity, manifest.fields.all, ctx.unparsers));
  };

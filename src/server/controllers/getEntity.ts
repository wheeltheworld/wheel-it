import type { RequestHandler } from "express";
import type { ManifestModel } from "../../shared/manifest";
import type { CrudModel } from "../genCrud";
import type { CTX } from "../ctx";
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
      relations: manifest.children.map((child) => child.name),
    });
    if (!entity) {
      return res
        .status(404)
        .send(`${model.name} with ${key}: '${req.params.value}' not found`);
    }
    for (const child of model.wheel.children) {
      const key = child.name as keyof CrudModel;
      // @ts-ignore
      entity[key] = (entity[key] as unknown as CrudModel[])?.map(
        (childEntity) => ({
          label: child.toString(childEntity),
          value: childEntity[child.relatedBy as keyof CrudModel],
        })
      );
    }
    entity.hideHiddens();
    return res.json(unparseData(entity, manifest.fields.all, ctx.unparsers));
  };

import type { RequestHandler } from "express";
import type { ManifestModel } from "../../shared/manifest";
import type { CrudModel } from "../genCrud";
import type { CTX } from "../ctx";
import { parseField } from "../utils/parseData";
import { isNullOrUndefined } from "../utils/isNullOrUndefined";
import { isTypeCorrect } from "../utils/isTypeCorrect";

export const updateEntity =
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
    const data = req.body;
    for (const field of manifest.fields.all) {
      if (field.isReadonly) continue;
      let value = data[field.name];
      if (isNullOrUndefined(value)) continue;
      if (!isTypeCorrect(value, field)) {
        return res
          .status(400)
          .send(`invalid field ${field.name}, expected type ${field.type}`);
      }

      value = parseField(field, value, ctx.parsers);

      entity[field.name as keyof CrudModel] = value;
    }

    for (const child of model.wheel.children) {
      const ids = data[child.name];
      if (!ids) continue;
      const children = await child.target().findByIds(ids);
      // @ts-ignore
      entity[child.name as keyof CrudModel] = children;
    }

    await entity.beforeUpdate?.();
    await entity.save();
    await entity.afterUpdate?.();
    entity.hideHiddens();

    return res.json(entity);
  };

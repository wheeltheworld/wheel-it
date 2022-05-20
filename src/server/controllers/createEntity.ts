import type { RequestHandler } from "express";
import type { ManifestModel } from "../../shared/manifest";
import type { CrudModel } from "../genCrud";
import type { CTX } from "../utils/ctx";
import { parseField } from "../utils/parseData";
import { isNullOrUndefined } from "../utils/isNullOrUndefined";
import { isTypeCorrect } from "../utils/isTypeCorrect";

export const createEntity =
  (
    model: typeof CrudModel,
    manifest: ManifestModel,
    ctx: CTX
  ): RequestHandler =>
  async (req, res) => {
    try {
      const entity = model.create();
      const data = req.body;
      for (const field of manifest.fields.all) {
        if (field.isReadonly) continue;
        let value = data[field.name];
        if (isNullOrUndefined(value) && field.isRequired) {
          return res.status(400).send(`field ${field.name} is required`);
        }
        if (isNullOrUndefined(value)) continue;
        if (!isTypeCorrect(value, field)) {
          res
            .status(400)
            .send(`invalid field ${field.name}, expected type ${field.type}`);
          return;
        }
        value = parseField(field, value, ctx.parsers);
        entity[field.name as keyof CrudModel] = value;
      }

      await entity.beforeCreate?.();
      await entity.save();
      await entity.afterCreate?.();
      entity.hideHiddens();

      return res.json(entity);
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  };

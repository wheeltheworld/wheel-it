import type { RequestHandler } from "express";
import type { CrudModel } from "../genCrud";
import { isNullOrUndefined } from "../utils/isNullOrUndefined";
import { isTypeCorrect } from "../utils/isTypeCorrect";

export const updateEntity =
  (model: typeof CrudModel, key: string): RequestHandler =>
  async (req, res) => {
    const entity = await model.findOne({
      where: { [key]: req.params.value },
    });
    if (!entity) {
      return res
        .status(404)
        .send(`${model.name} with ${key}: '${req.params.value}' not found`);
    }
    const fields = model.wheel.fields;
    for (const field of fields) {
      if (field.isReadonly) continue;
      if (isNullOrUndefined(req.body[field.name])) continue;
      if (!isTypeCorrect(req.body[field.name], field)) {
        return res
          .status(400)
          .send(`invalid field ${field.name}, expected type ${field.type}`);
      }

      entity[field.name as keyof CrudModel] = req.body[field.name];
    }

    await entity.beforeUpdate?.();
    await entity.save();
    await entity.afterUpdate?.();
    entity.hideHiddens();

    return res.json(entity);
  };

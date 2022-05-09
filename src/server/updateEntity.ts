import type { RequestHandler } from "express";
import type { CrudModel } from "./genCrud";
import { getFields } from "./getFields";

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
    const fields = getFields(model);
    for (const field of fields) {
      if (!field.editable) continue;
      if (
        req.body[field.name] !== undefined &&
        typeof req.body[field.name] !== field.type
      ) {
        res
          .status(400)
          .send(`invalid field ${field.name}, expected type ${field.type}`);
      }
      if (req.body === undefined) continue;

      entity[field.name as keyof CrudModel] = req.body[field.name];
    }

    await entity.beforeUpdate?.();
    await entity.save();
    await entity.afterUpdate?.();
    entity.hideHiddens();

    return res.json(entity);
  };

import type { RequestHandler } from "express";
import { getRepository } from "typeorm";
import type { CrudModel } from "../genCrud";

export const deleteEntity =
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

    await entity.beforeDelete?.();
    if (getRepository(model).metadata.deleteDateColumn) {
      await entity.softRemove();
    } else {
      entity.remove();
    }
    await entity.afterDelete?.();

    return res.json(true);
  };

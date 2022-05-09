import type { RequestHandler } from "express";
import type { CrudModel } from "./genCrud";

export const getEntity =
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
    entity.hideHiddens();
    return res.json(entity);
  };

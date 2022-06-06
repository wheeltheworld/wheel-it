import { getRepository } from "typeorm";
import type { CrudModel } from "../genCrud";
import { Controller, response } from "../utils/controller";

export const deleteEntity =
  (key: string): Controller =>
  async (model, _ctx, _data, by) => {
    const entity = await model.findOne<CrudModel>({
      where: { [key]: by },
    });
    if (!entity) {
      return response(`${model.name} with ${key}: '${by}' not found`, 404);
    }

    await entity.beforeDelete?.();
    if (getRepository(model).metadata.deleteDateColumn) {
      await entity.softRemove();
    } else {
      entity.remove();
    }
    await entity.afterDelete?.();

    return response(true);
  };

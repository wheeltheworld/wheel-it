import { unparseData } from "../utils/parseData";
import { Controller, response } from "../utils/controller";

export const getEntity =
  (key: string): Controller =>
  async (model, ctx, by) => {
    const entity = await model.findOne({
      where: { [key]: by },
      relations: model.wheel.manifest.relations.map(
        (relation) => relation.relationName
      ),
    });
    if (!entity) {
      return response(`${model.name} with ${key}: '${by}' not found`, 400);
    }
    entity.hideHiddens();
    return response(
      unparseData(entity, model.wheel.manifest.fields.all, ctx.unparsers)
    );
  };

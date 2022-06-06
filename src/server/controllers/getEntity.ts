import { unparseData } from "../utils/parseData";
import { Controller, response } from "../utils/controller";
import type { CrudModel } from "../genCrud";

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
    for (const relation of model.wheel.relations) {
      const relData = entity[relation.name as keyof CrudModel];
      const relModel = relation.target();
      if (Array.isArray(relData)) {
        const newArr = [];
        for (const item of relData) {
          newArr.push(unparseData(item, relModel.wheel.fields, ctx.unparsers));
        }
        // @ts-ignore
        entity[relation.name as keyof CrudModel] = newArr;
        continue;
      }
      if (relData) {
        // @ts-ignore
        entity[relation.name as keyof CrudModel] = unparseData(
          relData,
          relModel.wheel.fields,
          ctx.unparsers
        );
      }
    }
    entity.hideHiddens();
    return response(
      unparseData(entity, model.wheel.manifest.fields.all, ctx.unparsers)
    );
  };

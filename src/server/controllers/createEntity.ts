import type { CrudModel } from "../genCrud";
import { parseField } from "../utils/parseData";
import { isNullOrUndefined } from "../utils/isNullOrUndefined";
import { isTypeCorrect } from "../utils/isTypeCorrect";
import { Controller, response } from "../utils/controller";
import { updateEntity } from "./updateEntity";

export const createEntity: Controller = async (model, ctx, data) => {
  const entity = model.create();
  for (const field of model.wheel.manifest.fields.all) {
    if (field.isReadonly) continue;
    let value = data[field.name];
    if (isNullOrUndefined(value)) {
      if (field.isRequired) {
        return response(`field ${field.name} is required`, 400);
      }
      continue;
    }
    if (!isTypeCorrect(value, field)) {
      return response(
        `invalid field ${field.name}, expected type ${field.type}`,
        400
      );
    }
    value = parseField(field, value, ctx.parsers);
    entity[field.name as keyof CrudModel] = value;
  }

  for (const relation of model.wheel.relations) {
    const relationModel = relation.target();
    const relationData = data[relation.name];
    switch (relation.type) {
      case "relatesToOne":
        if (relationData === undefined) continue;
        if (relationData === null) {
          // @ts-ignore
          entity[relation.name as keyof CrudModel] = null;
          continue;
        }
        if (!["string", "number"].includes(typeof relationData)) {
          return response(
            `invalid field ${relation.name}, expected string or number`,
            400
          );
        }
        const relationEntity = await relationModel.findOne({
          where: { [relation.relatedBy]: relationData },
        });
        if (!relationEntity) {
          return response(
            `${relationModel.name} with ${relation.relatedBy}: '${relationData}' not found`,
            400
          );
        }
        // @ts-ignore
        entity[relation.name as keyof CrudModel] = relationEntity;
        break;
      case "ownsOne":
        if (!entity[relation.name as keyof CrudModel]) {
          const created = await createEntity(relationModel, ctx, relationData);
          entity[relation.name as keyof CrudModel] = created.body;
          break;
        }
        const res = await updateEntity(relation.relatedBy)(
          relationModel,
          ctx,
          relationData,
          relationData[relation.relatedBy]
        );
        entity[relation.name as keyof CrudModel] = res.body;
        break;
      case "relatesToMany":
      case "ownsMany":
        const savedRels = [];
        if (relationData === undefined) continue;
        for (const rel of relationData) {
          if (typeof rel === "object") {
            if (relation.relatedBy in rel) {
              const res = await updateEntity(relation.relatedBy)(
                relationModel,
                ctx,
                rel,
                rel[relation.relatedBy]
              );
              savedRels.push(res.body);
            } else {
              const res = await createEntity(relationModel, ctx, rel);
              savedRels.push(res.body);
            }
          } else if (["string", "number"].includes(typeof relationData)) {
            savedRels.push({ [relation.relatedBy]: relationData });
          }
        }
        // @ts-ignore
        entity[relation.name as keyof CrudModel] = savedRels;
        break;
      default:
        throw new Error(`unknown relation type ${relation.type}`);
    }
  }

  await entity.beforeCreate?.();
  await entity.save();
  await entity.afterCreate?.();
  entity.hideHiddens();

  return response(entity);
};

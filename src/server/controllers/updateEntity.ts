import type { CrudModel } from "../genCrud";
import { parseField } from "../utils/parseData";
import { isTypeCorrect } from "../utils/isTypeCorrect";
import { Controller, response } from "../utils/controller";
import { createEntity } from "./createEntity";
import { VTSType } from "../../client/utils/funcs/fieldValueToString";

export const updateEntity =
  (key: string): Controller =>
  async (model, ctx, data, by) => {
    const entity = await model.findOne<CrudModel>({
      where: { [key]: by },
      relations: model.wheel.relations.map((r) => r.name),
    });
    if (!entity) {
      return response(`${model.name} with ${key}: '${by}' not found`, 404);
    }
    for (const field of model.wheel.manifest.fields.all) {
      if (field.isReadonly) continue;
      let value = data[field.name];
      if (value === undefined) continue;
      if (value === null) {
        if (field.isRequired) {
          return response(`${field.name} is required`, 400);
        }

        // @ts-ignore
        entity[field.name] = null;
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
      if (!relationData) continue;
      switch (relation.type) {
        case VTSType.RelatesToOne:
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
        case VTSType.OwnsOne:
          if (!entity[relation.name as keyof CrudModel]) {
            const created = await createEntity(
              relationModel,
              ctx,
              relationData
            );
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
        case VTSType.RelatesToMany:
        case VTSType.OwnsMany:
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

    await entity.beforeUpdate?.();
    await entity.save();
    await entity.afterUpdate?.();
    entity.hideHiddens();

    return response(entity);
  };

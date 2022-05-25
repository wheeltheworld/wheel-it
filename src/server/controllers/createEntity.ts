import type { RequestHandler } from "express";
import type { ManifestModel } from "../../shared/manifest";
import type { CrudModel } from "../genCrud";
import type { CTX } from "../ctx";
import { parseField } from "../utils/parseData";
import { isNullOrUndefined } from "../utils/isNullOrUndefined";
import { isTypeCorrect } from "../utils/isTypeCorrect";
import { In } from "typeorm";

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

      for (const child of model.wheel.children) {
        const childModel = child.target();
        if (child.many) {
          const ids = data[child.name];
          if (!ids) continue;
          if (!Array.isArray(ids)) {
            return res
              .status(400)
              .send(`invalid field ${child.name}, expected array`);
          }
          const children = await childModel.find({
            where: { [child.relatedBy]: In(ids) },
          });
          // @ts-ignore
          entity[child.name as keyof CrudModel] = children;
        } else {
          const id = data[child.name];
          if (!id) continue;
          if (["string", "number"].includes(typeof id)) {
            return res
              .status(400)
              .send(`invalid field ${child.name}, expected string or number`);
          }
          const childEntity = await childModel.findOne({
            where: { [child.relatedBy]: id },
          });
          if (!childEntity) {
            return res
              .status(404)
              .send(
                `${childModel.name} with ${child.relatedBy}: '${id}' not found`
              );
          }
          // @ts-ignore
          entity[child.name as keyof CrudModel] = childEntity;
        }
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

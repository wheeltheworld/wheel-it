import { FindConditions, Like } from "typeorm";
import type { CrudModel } from "../genCrud";
import { unparseData } from "../utils/parseData";
import { Controller, response } from "../utils/controller";

export const listEntity: Controller = async (model, ctx, data) => {
  const limit = Math.min(Number(data.limit) || 25, 100);
  const offset = Number(data.page) * limit || 0;
  const query = data.query?.toString() || "";
  if (!query.match(/^[A-z\d\s]*$/)) {
    return response("Invalid query", 400);
  }
  let [items, count] = await model.findAndCount({
    take: limit,
    skip: offset,
    where: data.query
      ? (model.wheel.manifest.fields.searchables
          .map((f) => {
            if (
              (f.type === "int" || f.type === "float") &&
              isNaN(Number(query))
            ) {
              return undefined;
            }
            return {
              [f.name]: Like(`%${query}%`),
            };
          })
          .filter(Boolean) as FindConditions<CrudModel>)
      : undefined,
    order: data.sortBy
      ? {
          [data.sortBy as string]: data.sortOrder || "ASC",
        }
      : undefined,
  });
  items = items.map((item) => {
    item.hideHiddens();
    return unparseData(item, model.wheel.manifest.fields.all, ctx.unparsers);
  });
  
  return response({
    items,
    pages: Math.ceil(count / limit),
    amount: limit,
    total: count,
    page: offset / limit,
  });
};

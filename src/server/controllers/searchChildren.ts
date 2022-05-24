import type { RequestHandler } from "express";
import { FindConditions, Like } from "typeorm";
import type { CrudModel } from "../genCrud";
import type { CTX } from "../ctx";
import { unparseData } from "../utils/parseData";
import { modelName } from "../utils/modelName";

export const searchChildren = (
  parent: typeof CrudModel,
  name: string,
  ctx: CTX
): RequestHandler => {
  return async (req, res) => {
    const model = parent.wheel.children.find((c) => c.name === name)?.target();
    if (!model) {
      throw new Error(
        `INVALID CHILD '${name}' on model '${modelName(parent)}'`
      );
    }
    const manifest = model.wheel.manifest;
    try {
      const limit = Math.min(Number(req.query.limit) || 5, 25);
      const query = req.query.query?.toString() || "";
      if (!query) {
        return res.json({
          items: [],
          error: null,
        });
      }
      if (!query.match(/^[A-z\d\s]*$/)) {
        return res.status(400).json({
          error: "Invalid query",
          items: [],
        });
      }
      const items = await model.find({
        take: limit,
        where: req.query.query
          ? (manifest.fields.searchables
              .map((f) => {
                if (f.type === "string") {
                  return {
                    [f.name]: Like(`%${req.query.query}%`),
                  };
                }
                if (
                  (f.type === "int" || f.type === "float") &&
                  isNaN(Number(req.query.query))
                ) {
                  return undefined;
                }
                return {
                  [f.name]: req.query.query,
                };
              })
              .filter(Boolean) as FindConditions<CrudModel>)
          : undefined,
        order: req.query.sortBy
          ? {
              [req.query.sortBy as string]: req.query.sortOrder || "ASC",
            }
          : undefined,
      });
      const results = items.map((item) => {
        item.hideHiddens();
        const child = parent.wheel.children.find((c) => c.name === name);
        if (!child) {
          return res.status(400).json({ error: "invalid child name" });
        }
        item = unparseData(item, manifest.fields.all, ctx.unparsers);
        return {
          label:
            typeof child.toString === "function"
              ? child.toString(item)
              : child.toString,
          value: item[child.relatedBy as keyof CrudModel],
        };
      });
      return res.json({
        items: results,
        error: null,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: "Unexpected error",
        items: [],
      });
    }
  };
};

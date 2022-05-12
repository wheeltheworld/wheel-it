import type { RequestHandler } from "express";
import { Like } from "typeorm";
import type { ManifestModel } from "../../shared/manifest";
import type { CrudModel } from "../genCrud";

export const listEntity =
  (model: typeof CrudModel, manifest: ManifestModel): RequestHandler =>
  async (req, res) => {
    const limit = Math.min(Number(req.query.limit) || 25, 100);
    const offset = Number(req.query.page) * limit || 0;
    const query = req.query.query?.toString() || "";
    if (!query.match(/^[A-z\d\s]*$/)) {
      return res.status(400).json({
        error: "Invalid query",
      });
    }
    console.log(
      req.query.query
        ? manifest.fields.searchables.map((f) => ({
            [f.name]: Like(`%${req.query.query}%`),
          }))[0]
        : undefined
    );
    const [items, count] = await model.findAndCount({
      take: limit,
      skip: offset,
      where: req.query.query
        ? manifest.fields.searchables.map((f) => ({
            [f.name]: Like(`%${req.query.query}%`),
          }))[0]
        : undefined,
      order: req.query.sortBy
        ? {
            [req.query.sortBy as string]: req.query.sortOrder || "ASC",
          }
        : undefined,
    });
    items.map((item) => item.hideHiddens());
    return res.json({
      items,
      pages: Math.ceil(count / limit),
      amount: limit,
      total: count,
      page: offset / limit,
    });
  };

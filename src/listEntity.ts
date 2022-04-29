import type { RequestHandler } from "express";
import type { BaseEntity } from "typeorm";

export const listEntity =
  (model: typeof BaseEntity): RequestHandler =>
  async (req, res) => {
    const limit = Number(req.query.limit) || 25;
    const offset = Number(req.query.page) * limit || 0;
    const [items, count] = await model.findAndCount({
      take: limit,
      skip: offset,
    });
    return res.json({
      items,
      pages: Math.ceil(count / limit),
      amount: limit,
      total: count,
      page: offset / limit,
    });
  };

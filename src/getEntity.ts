import type { RequestHandler } from "express";
import type { BaseEntity } from "typeorm";

export const getEntity =
  (model: typeof BaseEntity, key: string): RequestHandler =>
  async (req, res) => {
    const entity = await model.findOne({
      where: { id: req.params.id },
    });
    return res.json({
      items,
      pages: Math.ceil(count / limit),
      amount: limit,
      total: count,
      page: offset / limit,
    });
  };

import type { RequestHandler } from "express";
import { listEntity } from "../controllers/listEntity";
import type { CTX } from "../ctx";
import type { CrudModel } from "../genCrud";

export const listEntityHandler =
  (model: typeof CrudModel, ctx: CTX): RequestHandler =>
  async (req, res) => {
    try {
      const response = await listEntity(model, ctx, req.query);
      return response(res);
    } catch (error) {
      console.log(error);
      return res.status(500).send("Unexpected Error, please try again later");
    }
  };

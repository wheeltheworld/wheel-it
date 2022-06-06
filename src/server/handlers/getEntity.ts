import type { RequestHandler } from "express";
import { getEntity } from "../controllers/getEntity";
import type { CTX } from "../ctx";
import type { CrudModel } from "../genCrud";

export const getEntityHandler =
  (model: typeof CrudModel, ctx: CTX, key: string): RequestHandler =>
  async (req, res) => {
    try {
      const response = await getEntity(key)(model, ctx, req.params.value);
      return response(res);
    } catch (error) {
      console.log(error);
      return res.status(500).send("Unexpected Error, please try again later");
    }
  };

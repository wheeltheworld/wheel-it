import type { RequestHandler } from "express";
import { createEntity } from "../controllers/createEntity";
import type { CTX } from "../ctx";
import type { CrudModel } from "../genCrud";

export const createEntityHandler =
  (model: typeof CrudModel, ctx: CTX): RequestHandler =>
  async (req, res) => {
    try {
      const response = await createEntity(model, ctx, req.body);
      return response(res);
    } catch (error) {
      console.log(error);
      return res.status(500).send("Unexpected Error, please try again later");
    }
  };

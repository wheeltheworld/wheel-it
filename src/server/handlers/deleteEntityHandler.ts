import type { RequestHandler } from "express";
import { deleteEntity } from "../controllers/deleteEntity";
import type { CTX } from "../ctx";
import type { CrudModel } from "../genCrud";

export const deleteEntityHandler =
  (model: typeof CrudModel, ctx: CTX, key: string): RequestHandler =>
  async (req, res) => {
    try {
      const response = await deleteEntity(key)(
        model,
        ctx,
        undefined,
        req.params.value
      );
      return response(res);
    } catch (error) {
      console.log(error);
      return res.status(500).send("Unexpected Error, please try again later");
    }
  };

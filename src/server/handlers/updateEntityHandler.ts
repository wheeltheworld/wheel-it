import type { RequestHandler } from "express";
import { updateEntity } from "../controllers/updateEntity";
import type { CTX } from "../ctx";
import type { CrudModel } from "../genCrud";

export const updateEntityHandler =
  (model: typeof CrudModel, ctx: CTX, key: string): RequestHandler =>
  async (req, res) => {
    try {
      const response = await updateEntity(key)(
        model,
        ctx,
        req.body,
        req.params.value
      );
      return response(res);
    } catch (error) {
      console.log(error);
      return res.status(500).send("Unexpected Error, please try again later");
    }
  };

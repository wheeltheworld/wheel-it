import type { Response as IResponse } from "express";
import type { CTX } from "../ctx";
import type { CrudModel } from "../genCrud";

export type PromiseOrNot<T> = T | Promise<T>;

export type Controller = (
  model: typeof CrudModel,
  ctx: CTX,
  data: any,
  by?: string
) => PromiseOrNot<Response>;

interface Response {
  (res: IResponse): void;
  status: number;
  body: any;
}

export const response = (body: any, status: number = 200) => {
  const result: Response = (res) => {
    if (body === null) {
      return res.sendStatus(status);
    }
    if (typeof body === "string") {
      return res.status(status).send(body);
    }
    return res.status(status).json(body);
  };

  result.status = status;
  result.body = body;

  return result;
};

import { RequestHandler, Router } from "express";
import { createEntity } from "./createEntity";
import { deleteEntity } from "./deleteEntity";
import type { Module } from "./genCrud";
import { getEntity } from "./getEntity";
import { listEntity } from "./listEntity";
import { updateEntity } from "./updateEntity";

enum Method {
  GET = "get",
  POST = "post",
  PUT = "put",
  DELETE = "delete",
  PATCH = "patch",
}

interface ModelEndpoints {
  create: [Method, string];
  get: [Method, string][];
  list: [Method, string];
  update: [Method, string][];
  delete: [Method, string][];
}

interface ModuleEndpoints {
  [model: string]: ModelEndpoints;
}

export const genCrudModule = (
  mod: Module
): [RequestHandler, ModuleEndpoints] => {
  const router = Router();
  const models: ModuleEndpoints = {};
  for (const model of mod.models) {
    const modelEndpoints: ModelEndpoints = {
      create: [Method.POST, "/"],
      list: [Method.GET, "/"],
      get: [],
      update: [],
      delete: [],
    };
    const modelRouter = Router();
    modelRouter.post("/", createEntity(model));
    modelRouter.get("/", listEntity(model));
    for (const getable of model.prototype.wheel.getables || []) {
      modelRouter.get(`/${getable}/:value`, getEntity(model, getable));
      modelEndpoints.get.push([Method.GET, `/${getable}/:value`]);

      modelRouter.patch(`/${getable}/:value`, updateEntity(model, getable));
      modelEndpoints.update.push([Method.PATCH, `/${getable}/:value`]);

      modelRouter.delete(`/${getable}/:value`, deleteEntity(model, getable));
      modelEndpoints.delete.push([Method.DELETE, `/${getable}/:value`]);
    }
    router.use(`/${model.name}`, modelRouter);
    models[model.name] = modelEndpoints;
  }
  return [router, models];
};

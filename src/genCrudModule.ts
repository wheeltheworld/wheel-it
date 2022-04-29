import { RequestHandler, Router } from "express";
import { createEntity } from "./createEntity";
import type { Module } from "./genCrud";
import { listEntity } from "./listEntity";

export const genCrudModule = (mod: Module): RequestHandler => {
  const router = Router();
  for (const model of mod.models) {
    router.post(`/${model.name}`, createEntity(model));
    router.get(`/${model.name}`, listEntity(model));
  }
  return router;
};

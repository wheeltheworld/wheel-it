import { RequestHandler, Router } from "express";
import { readdirSync } from "fs";
import type { BaseEntity } from "typeorm";
import { isModelsDirectory } from "./utils/isModelsDirectory";
import callsite from "callsite";
import { dirname, join } from "path";
import { genCrudModule } from "./genModuleCrud";
import { genManifest } from "./genManifest";
import type { Field, ManifestModel } from "../shared/manifest";
import type { CTX } from "./ctx";
import type { Parser } from "./utils/parseData";
import type { ChildConfig } from "./decorators/relations";

type PromiseOrNot<T> = T | Promise<T>;

interface ModuleDeclaration {
  src: string;
  icon?: string;
  label?: string;
  name?: string;
}

export interface GenCrudSettings {
  modules: ModuleDeclaration[];
  modelsDir: string | RegExp;
  parsers: Record<string, Parser<any>>;
  unparsers: Record<string, Parser<any>>;
}

export interface Wheel {
  isOkay: boolean;
  isAutonomous: boolean;
  fields: Field[];
  relations: ChildConfig<any>[];
  icon?: string;
  label?: string;
  manifest: ManifestModel;
}

export declare class CrudModel extends BaseEntity {
  static wheel: Wheel;
  hideHiddens(): void;
  beforeCreate?(): PromiseOrNot<void>;
  afterCreate?(): PromiseOrNot<void>;
  beforeUpdate?(): PromiseOrNot<void>;
  afterUpdate?(): PromiseOrNot<void>;
  beforeDelete?(): PromiseOrNot<void>;
  afterDelete?(): PromiseOrNot<void>;
}

export interface Module {
  name: string;
  label: string;
  icon?: string;
  models: typeof CrudModel[];
}

const defaultSettings: GenCrudSettings = {
  modules: [],
  modelsDir: "models",
  parsers: {},
  unparsers: {},
};

export const genCrud = (options?: Partial<GenCrudSettings>): RequestHandler => {
  const settings: GenCrudSettings = {
    ...defaultSettings,
    ...options,
  };

  const router = Router();

  // we get where the function is called from
  // so we can build relative paths
  // https://stackoverflow.com/questions/18144921/how-do-i-get-the-dirname-of-the-calling-method-when-it-is-in-a-different-file-in
  const root = dirname(callsite()[1].getFileName());

  settings.modules = settings.modules.map((mod) => ({
    ...mod,
    src: join(root, mod.src),
  }));

  const modules: Record<string, Module> = {};

  for (const mod of settings.modules) {
    const name = mod.name || mod.src.match(/[A-z]+$/)?.[0];
    if (!name) {
      console.warn(`invalid module dir: ${mod.src}`);
      continue;
    }
    modules[name] = {
      name,
      label: mod.label || name,
      icon: mod.icon,
      models: [],
    };
    const dirs = readdirSync(`${mod.src}`, {
      withFileTypes: true,
    }).filter((dir) => dir.isDirectory());
    for (const dir of dirs) {
      if (isModelsDirectory(dir, settings)) {
        for (const file of readdirSync(`${mod.src}/${dir.name}`, {
          withFileTypes: true,
        }).filter((file) => file.isFile())) {
          if (file.name.match(/\.[jt]s$/)) {
            const exported = require(`${mod.src}/${dir.name}/${file.name}`);
            for (const model of Object.values(exported) as typeof CrudModel[]) {
              if (model && model instanceof Function && model.wheel?.isOkay) {
                modules[name].models.push(model as typeof CrudModel);
              }
            }
          }
        }
      }
    }
  }

  const manifest = genManifest(Object.values(modules));

  const ctx: CTX = {
    parsers: settings.parsers,
    unparsers: settings.unparsers,
    manifest,
  };

  router.get(`/manifest`, (_req, res) => {
    return res.status(200).json(manifest);
  });
  for (const mod of Object.values(modules)) {
    const middleware = genCrudModule(mod, manifest.modules[mod.name], ctx);
    router.use(`/module`, middleware);
  }
  return Router().use("/_/api/", router);
};

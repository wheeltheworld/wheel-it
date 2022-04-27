import type { RequestHandler } from "express";
import { readdirSync } from "fs";
import { BaseEntity } from "typeorm";
import { isModelsDirectory } from "./utils/isModelsDirectory";
import callsite from "callsite";

export interface GenCrudSettings {
  modules: string[];
  modelsDir: string | RegExp;
}

interface Module {
  models: typeof BaseEntity[];
}

const defaultSettings: GenCrudSettings = {
  modules: [],
  modelsDir: "models",
};

export const genCrud = (options?: Partial<GenCrudSettings>): RequestHandler => {
  const settings: GenCrudSettings = {
    ...defaultSettings,
    ...options,
  };

  const root = callsite()[0].getFileName();
  console.log(root);

  const dirents = readdirSync(`${root}${settings.modules[0]}`, {
    withFileTypes: true,
  });

  const modules: Record<string, Module> = {};

  for (const dirent of dirents) {
    if (dirent.isDirectory()) {
      modules[dirent.name] = {
        models: [],
      };
      const dirs = readdirSync(`${settings.modules}/${dirent.name}`, {
        withFileTypes: true,
      }).filter((dir) => dir.isDirectory());
      for (const dir of dirs) {
        if (isModelsDirectory(dir, settings)) {
          for (const file of readdirSync(
            `${settings.modules}/${dirent.name}/${dir.name}`,
            { withFileTypes: true }
          )) {
            if (file.isFile() && file.name.match(/\.(jt)s$/)) {
              const exported = require(`${settings.modules}/${dirent.name}/${dir.name}/${file.name}`);
              for (const model of Object.values(exported) as Function[]) {
                if (
                  model &&
                  "prototype" in model &&
                  model.prototype instanceof BaseEntity &&
                  // @ts-ignore
                  model.prototype.wheel
                ) {
                  modules[dirent.name].models.push(model as typeof BaseEntity);
                }
              }
            }
          }
        }
      }
    }
  }
  return (_req, _res, next) => {
    console.log(JSON.stringify(modules, null, 2));
    next();
  };
};

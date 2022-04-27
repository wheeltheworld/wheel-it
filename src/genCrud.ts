import type { RequestHandler } from "express";
import { readdirSync } from "fs";
import { BaseEntity } from "typeorm";
import { isModelsDirectory } from "./utils/isModelsDirectory";

export interface GenCrudSettings {
  modules: string;
  modelsSubdir: string | RegExp;
}

interface Module {
  models: BaseEntity[];
}

const defaultSettings: GenCrudSettings = {
  modules: "modules",
  modelsSubdir: "models",
};

export const genCrud = (options?: Partial<GenCrudSettings>): RequestHandler => {
  const settings: GenCrudSettings = {
    ...defaultSettings,
    ...options,
  };

  const dirents = readdirSync(settings.modules, {
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
            if (file.isFile()) {
              const model =
                require(`${settings.modules}/${dirent.name}/${dir.name}/${file.name}`).default;
              if (
                model.prototype instanceof BaseEntity &&
                model.prototype.wheel
              ) {
                modules[dirent.name].models.push(model);
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

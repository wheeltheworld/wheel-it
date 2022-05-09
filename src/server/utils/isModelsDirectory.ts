import type { Dirent } from "fs";
import type { GenCrudSettings } from "../genCrud";

export const isModelsDirectory = (
  dirent: Dirent,
  settings: GenCrudSettings
) => {
  return dirent.isDirectory() && dirent.name.match(settings.modelsDir);
};

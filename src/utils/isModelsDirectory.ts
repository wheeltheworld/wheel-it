import { Dirent } from "fs";
import { GenCrudSettings } from "../genCrud";

export const isModelsDirectory = (
  dirent: Dirent,
  settings: GenCrudSettings
) => {
  return dirent.isDirectory() && dirent.name.match(settings.modelsSubdir);
};

import type { CrudModel } from "../genCrud";

export const modelName = (model: typeof CrudModel): string => {
  return model.name.toLowerCase();
};

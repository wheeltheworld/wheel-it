import type { BaseEntity } from "typeorm";

export const getFields = (entity: typeof BaseEntity) => {
  return entity.getRepository().metadata.columns.map((column) => ({
    name: column.propertyName,
    type: column.type,
  }));
};

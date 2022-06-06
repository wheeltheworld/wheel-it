import type { ManifestModel } from "../../../shared/manifest";

export type RelationModifies = Record<string, any[]>;

export const cleanData = (
  manifest: ManifestModel,
  data: any,
  relationModifies: RelationModifies
) => {
  const copy = JSON.parse(JSON.stringify(data));

  for (const relation of manifest.relations) {
    const value = copy[relation.name];
    const modifies = relationModifies[relation.name];
    if (!modifies) continue;
    if (relation.type === "relatesToOne") {
      if (value) {
        copy[relation.name] = value[relation.relatedBy];
      }
    }
    if (["relatesToMany", "ownsMany"].includes(relation.type)) {
      const newVal = [];
      for (const item of value) {
        if (item[relation.relatedBy] === undefined) {
          continue;
        }
        if (modifies.includes(item[relation.relatedBy])) {
          continue;
        }
        newVal.push(item[relation.relatedBy]);
      }
    }
  }
  return copy;
};

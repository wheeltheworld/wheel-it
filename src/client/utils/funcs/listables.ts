import type { ManifestModel } from "../../../shared/manifest";
import type { FieldsAndRels } from "../../pages/ListPage";

export const getListables = (manifest: ManifestModel) => {
  const listableRels = manifest.relations.filter(
    (f) => f.isListable && !f.isHidden
  );
  const listables = ([] as FieldsAndRels)
    .concat(manifest.fields.listables, listableRels)
    .filter(Boolean);
  listables.sort((a, b) => a.position - b.position);
  return listables;
};

export const getIndexables = (manifest: ManifestModel) => {
  const indexableRels: FieldsAndRels = manifest.relations.filter(
    (f) => f.indexable
  );
  const indexables: FieldsAndRels = ([] as FieldsAndRels)
    .concat(manifest.fields.indexables, indexableRels)
    .filter(Boolean);
  indexables.sort((a, b) => a.position - b.position);
  return indexables;
};

export const getPreviewables = (manifest: ManifestModel) => {
  const previewableRels: FieldsAndRels = manifest.relations.filter(
    (f) => f.isPreviewable && !f.isHidden
  );
  const previewables: FieldsAndRels = ([] as FieldsAndRels)
    .concat(manifest.fields.previewables, previewableRels)
    .filter(Boolean);
  previewables.sort((a, b) => a.position - b.position);
  return previewables;
};

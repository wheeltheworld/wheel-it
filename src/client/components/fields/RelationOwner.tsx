import React from "react";
import type { ManifestRelation } from "../../../shared/manifest";
import FormGenerator from "../FormGenerator";

interface RelationOwnerProps {
  moduleName: string;
  modelName: string;
  childName: string;
  onChange?: (value: any) => void;
  relation: ManifestRelation;
  value: any;
}

const RelationOwner: React.FC<RelationOwnerProps> = ({
  moduleName,
  childName,
  onChange,
  value,
}) => {
  return (
    <FormGenerator
      isChild
      moduleName={moduleName}
      modelName={childName}
      initValues={value}
      onChange={onChange}
    />
  );
};

export default RelationOwner;

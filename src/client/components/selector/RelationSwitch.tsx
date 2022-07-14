import { Box, Text } from "@chakra-ui/react";
import React, { PropsWithChildren } from "react";
import type { ManifestRelation } from "../../../shared/manifest";
import OwnedRelationsManager from "../fields/OwnedRelationsManager";
import RelationOwner from "../fields/RelationOwner";
import RelationSelector from "../fields/RelationSelector";

interface RelationSelectorProps {
  onChange: (value: any, modifies?: any[]) => void;
  value: any;
  relation: ManifestRelation;
  moduleName: string;
  modelName: string;
  childName: string;
}

const Wrapper: React.FC<PropsWithChildren<{ label: string }>> = ({
  label,
  children,
}) => (
  <Box
    borderRadius="10px"
    border="1px solid lightgray"
    padding="20px"
    my="20px"
    overflowX="scroll"
  >
    <Text fontSize="20px" fontWeight="bold">
      {label}
    </Text>
    {children}
  </Box>
);

const RelationSwitch: React.FC<RelationSelectorProps> = (props) => {
  const { relation } = props;
  switch (relation.type) {
    case "relatesToOne":
      return (
        <Wrapper label={relation.label}>
          <RelationSelector {...props} />
        </Wrapper>
      );
    case "relatesToMany":
    case "ownsMany":
      return (
        <Wrapper label={relation.label}>
          <OwnedRelationsManager {...props} />
        </Wrapper>
      );
    case "ownsOne":
      return (
        <Wrapper label={relation.label}>
          <RelationOwner {...props} />
        </Wrapper>
      );
    default:
      return <Text>Invalid relation type</Text>;
  }
};

export default RelationSwitch;

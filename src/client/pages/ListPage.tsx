import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import React from "react";
import { useEntities } from "../utils/useEntities";
import useManifest from "../utils/useManifest";

interface ListPageProps {
  moduleName: string;
  modelName: string;
}

const ListPage: React.FC<ListPageProps> = ({ moduleName, modelName }) => {
  const { items } = useEntities({
    moduleName,
    modelName,
  });
  const manifest = useManifest().get({ moduleName, modelName });

  return (
    <>
      <Table>
        <Thead>
          {manifest?.fields.map((field) => (
            <Th key={field.name}>{field.label || field.name}</Th>
          ))}
        </Thead>
        <Tbody>
          {items?.map((item, i) => (
            <Tr key={i}>
              {manifest?.fields.map((field) => (
                <Td key={field.name}>{item[field.name]?.toString()}</Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  );
};

export default ListPage;

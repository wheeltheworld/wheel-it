import {
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Button,
  Flex,
} from "@chakra-ui/react";
import React from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import Paginator from "../components/Paginator";
import { useEntities } from "../utils/useEntities";
import useManifest from "../utils/useManifest";
import { useQuery } from "../utils/useQuery";

interface ListPageProps {
  moduleName: string;
  modelName: string;
}

const ListPage: React.FC<ListPageProps> = ({ moduleName, modelName }) => {
  const manifest = useManifest().get({ moduleName, modelName });
  const query = useQuery();
  const page = Number(query.get("page")) || 1;
  const amount = Number(query.get("amount")) || 25;
  const { items, pages } = useEntities({
    moduleName,
    modelName,
    page: page - 1,
    amount,
  });
  const { push } = useHistory();

  return (
    <>
      <Flex>
        <Button as={RouterLink} to={`/_/${moduleName}/${modelName}/create`}>
          Create {modelName}
        </Button>
        <Paginator
          page={page}
          pages={pages || 1}
          onChange={({ number, amount }) => {
            push(
              `/_/${moduleName}/${modelName}?page=${number}&amount=${amount}`
            );
          }}
        />
      </Flex>
      <Table>
        <Thead>
          <Tr>
            {manifest?.fields.map((field) => (
              <Th key={field.name}>{field.label || field.name}</Th>
            ))}
          </Tr>
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

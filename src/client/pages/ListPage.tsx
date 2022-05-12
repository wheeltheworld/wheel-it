import {
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Button,
  Flex,
  Link,
  Input,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import Paginator from "../components/Paginator";
import { useEntities } from "../utils/hooks/useEntities";
import useManifest from "../utils/hooks/useManifest";
import { useQuery } from "../utils/hooks/useQuery";

interface ListPageProps {
  moduleName: string;
  modelName: string;
}

const ListPage: React.FC<ListPageProps> = ({ moduleName, modelName }) => {
  const manifest = useManifest().get({ moduleName, modelName });
  const query = useQuery();
  const [page, setPage] = useState(Number(query.get("page")) || 1);
  const [amount, setAmount] = useState(Number(query.get("amount")) || 25);
  const [search, setSearch] = useState(query.get("search") || "");
  const { items, pages } = useEntities({
    moduleName,
    modelName,
    page: page - 1,
    amount,
    query: search,
  });
  const { push } = useHistory();

  useEffect(() => {
    push(
      `/_/${moduleName}/${modelName}?page=${page}&amount=${amount}&search=${search}`
    );
  }, [page, amount, search]);

  return (
    <>
      <Flex>
        <Button as={RouterLink} to={`/_/${moduleName}/${modelName}/create`}>
          Create {modelName}
        </Button>
        <Input
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          value={search}
        />
        <Paginator
          page={page}
          pages={pages || 1}
          onChange={({ number, amount }) => {
            setAmount(amount);
            setPage(number);
          }}
        />
      </Flex>
      <Table>
        <Thead>
          <Tr>
            {manifest?.fields.listables.map((field) => (
              <Th key={field.name}>{field.label || field.name}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {items?.map((item, i) => (
            <Tr key={i}>
              {manifest?.fields.listables.map((field) => (
                <Td key={field.name}>
                  {manifest.fields.indexables
                    .map((f) => f.name)
                    .includes(field.name) ? (
                    <Link
                      as={RouterLink}
                      to={`/_/${moduleName}/${modelName}/${field.name}/${
                        item[field.name]
                      }`}
                    >
                      {item[field.name]?.toString()}
                    </Link>
                  ) : (
                    item[field.name]?.toString()
                  )}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  );
};

export default ListPage;

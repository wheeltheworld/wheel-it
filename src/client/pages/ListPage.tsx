import {
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Flex,
  Link,
  Input,
  LinkBox,
  LinkOverlay,
  Heading,
  Box,
  InputLeftElement,
  InputGroup,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import type { Field, ManifestRelation } from "../../shared/manifest";
import Paginator from "../components/Paginator";
import { fieldValueToString } from "../utils/funcs/fieldValueToString";
import { useEntities } from "../utils/hooks/useEntities";
import useManifest from "../utils/hooks/useManifest";
import { useQuery } from "../utils/hooks/useQuery";
import { FilterIcon, MoreIcon, SearchIcon } from "wtw-icons/icons";
import { getIndexables, getListables } from "../utils/funcs/listables";

interface ListPageProps {
  moduleName: string;
  modelName: string;
  modelLabel: string;
}

export type FieldsAndRels = (Field | ManifestRelation)[];

const ListPage: React.FC<ListPageProps> = ({
  moduleName,
  modelName,
  modelLabel,
}) => {
  const query = useQuery();
  const manifest = useManifest().get({ moduleName, modelName });

  const [page, setPage] = useState(Number(query.get("page")) || 1);
  const [amount, setAmount] = useState(Number(query.get("amount")) || 25);
  const [search, setSearch] = useState(query.get("search") || "");

  const navigate = useNavigate();
  const { items, pages } = useEntities({
    moduleName,
    modelName,
    page: page - 1,
    amount,
    query: search,
  });

  useEffect(() => {
    navigate(
      `/_/${moduleName}/${modelName}?page=${page}&amount=${amount}&search=${search}`
    );
  }, [page, amount, search]);

  if (!manifest) {
    return null;
  }

  const listables = getListables(manifest);
  const indexables = getIndexables(manifest);

  const isRowClickable = !Boolean(
    indexables.filter((i) => i.indexable && i.isListable).length
  );

  const rowElements = (item: any, isRowClickable: boolean) =>
    listables.map((field, i) => {
      const value = fieldValueToString(field, item[field.name]);
      return isRowClickable ? (
        <Td key={field.name}>
          {i === 0 ? (
            <LinkOverlay href={`/_/${moduleName}/${modelName}/id/${item.id}`}>
              {value}
            </LinkOverlay>
          ) : (
            value
          )}
        </Td>
      ) : (
        <Td key={field.name}>
          {indexables.map((f) => f.name).includes(field.name) ? (
            <Link
              as={RouterLink}
              to={`/_/${moduleName}/${modelName}/${field.name}/${
                item[field.name]
              }`}
            >
              {value}
            </Link>
          ) : (
            value
          )}
        </Td>
      );
    });

  return (
    <>
      <Flex justify="space-between">
        <Heading>{modelLabel}</Heading>
        <InputGroup maxW="300px">
          <InputLeftElement
            pointerEvents="none"
            children={<Box as={SearchIcon} boxSize="20px" display="block" />}
          />
          <Input
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            value={search}
            rounded="3xl"
            borderColor="#949494"
            _disabled={{ borderColor: "#E5E5E5" }}
            _hover={{ borderColor: "#575757" }}
            _focus={{
              borderColor: "#575757",
              boxShadow: "0 0 0 1px #575757",
            }}
          />
        </InputGroup>
      </Flex>
      <Flex justify="space-between" marginTop={6}>
        <Link
          as={RouterLink}
          to={`/_/${moduleName}/${modelName}/create`}
          bgColor="#02B2AD"
          color="white"
          p="10px 20px"
          rounded="md"
          _hover={{ bgColor: "#007187" }}
          display="block"
        >
          <Flex align="center" sx={{ gap: "10px" }}>
            Create {modelName}
            <Box as={MoreIcon} boxSize="24px" display="block" />
          </Flex>
        </Link>
        <Link
          as={RouterLink}
          to=""
          rounded="md"
          display="block"
          w="fit-content"
          p="10px 20px"
          bgColor="transparent"
          color="#02B2AD"
          border="1px solid"
          borderColor="#02B2AD"
          _hover={{ bgColor: "#D1F1F0" }}
          _focus={{
            bgColor: "#D1F1F0",
            borderColor: "#007187",
            color: "#007187",
          }}
          _disabled={{
            bgColor: "#D1F1F0",
            opacity: 0.5,
          }}
        >
          <Flex align="center" sx={{ gap: "10px" }}>
            <Box as={FilterIcon} boxSize="24px" display="block" />
            Filters
          </Flex>
        </Link>
      </Flex>
      <Table mt="20px">
        <Thead>
          <Tr>
            {listables.map((field) => (
              <Th key={field.name}>{field.label || field.name}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {items?.map((item, i) =>
            isRowClickable ? (
              <LinkBox as={Tr} key={i}>
                {rowElements(item, isRowClickable)}
              </LinkBox>
            ) : (
              <Tr key={i}>{rowElements(item, isRowClickable)}</Tr>
            )
          )}
        </Tbody>
      </Table>
      <Flex justify="center" marginTop={6}>
        <Paginator
          page={page}
          pages={pages || 1}
          onChange={({ number, amount }) => {
            setAmount(amount);
            setPage(number);
          }}
        />
      </Flex>
    </>
  );
};

export default ListPage;

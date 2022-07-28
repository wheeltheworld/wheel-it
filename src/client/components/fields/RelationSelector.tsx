import {
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Button,
  Flex,
  Input,
  Modal,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import type { ManifestRelation } from "../../../shared/manifest";
import { fieldValueToString } from "../../utils/funcs/fieldValueToString";
import { getListables } from "../../utils/funcs/listables";
import { useEntities } from "../../utils/hooks/useEntities";
import useManifest from "../../utils/hooks/useManifest";
import Paginator from "../Paginator";

interface RelationSelectorProps {
  moduleName: string;
  modelName: string;
  childName: string;
  value: any;
  onChange: (value: any) => void;
  relation: ManifestRelation;
}

const RelationSelector: React.FC<RelationSelectorProps> = ({
  moduleName,
  childName,
  value,
  onChange,
}) => {
  const manifest = useManifest().get({ moduleName, modelName: childName });

  const [selected, setSelected] = useState(value || null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { isOpen, onClose, onOpen } = useDisclosure();
  const { items, pages } = useEntities({
    moduleName,
    modelName: childName,
    page: page - 1,
    amount: 10,
    query: search,
  });

  useEffect(() => {
    onChange(selected);
  }, [selected]);

  const listables = getListables(manifest);

  if (selected) {
    return (
      <Table mt="20px">
        <Thead>
          <Tr>
            {listables.map((field) => (
              <Th key={field.name}>{field.label || field.name}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            {listables.map((field) => (
              <Td key={field.name}>{fieldValueToString(field, selected)}</Td>
            ))}
            <Td>
              <Button
                colorScheme="red"
                onClick={() => {
                  setSelected(null);
                }}
              >
                Remove
              </Button>
            </Td>
          </Tr>
        </Tbody>
      </Table>
    );
  }

  return (
    <>
      <Button onClick={onOpen} colorScheme="blue">
        Select
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody>
            <Flex justify="flex-end">
              <Input
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                value={search}
                maxW="300px"
              />
              <Paginator
                page={page}
                pages={pages || 1}
                withAmount={false}
                onChange={({ number }) => {
                  setPage(number);
                }}
              />
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
                {items?.map((item, i) => (
                  <Tr key={i}>
                    {listables.map((field) => (
                      <Td key={field.name}>
                        {fieldValueToString(field, item[field.name])}
                      </Td>
                    ))}
                    <Td>
                      <Button
                        colorScheme="blue"
                        onClick={() => {
                          setSelected(item);
                        }}
                      >
                        Add
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RelationSelector;

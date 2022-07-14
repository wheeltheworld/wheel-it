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
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import type { ManifestRelation } from "../../../shared/manifest";
import type { FieldsAndRels } from "../../pages/ListPage";
import { fieldValueToString } from "../../utils/funcs/fieldValueToString";
import { useEntities } from "../../utils/hooks/useEntities";
import useManifest from "../../utils/hooks/useManifest";
import Paginator from "../Paginator";

interface RelationAdderProps {
  moduleName: string;
  modelName: string;
  childName: string;
  value: any[];
  onChange: (value: any) => void;
  relation: ManifestRelation;
}

const RelationAdder: React.FC<RelationAdderProps> = ({
  moduleName,
  childName,
  value,
  onChange,
  relation,
}) => {
  const manifest = useManifest().get({ moduleName, modelName: childName });
  const [selected, setSelected] = useState(value || []);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { items, pages } = useEntities({
    moduleName,
    modelName: childName,
    page: page - 1,
    amount: 10,
    query: search,
  });

  const handleSelect = (item: any) => {
    if (isSelected(item)) return;

    setSelected([...selected, item]);
  };

  const handleDeselect = (item: any) => {
    setSelected(
      selected.filter((i) => i[relation.relatedBy] !== item[relation.relatedBy])
    );
  };

  const isSelected = (item: any) => {
    return selected.find(
      (i) => i[relation.relatedBy] === item[relation.relatedBy]
    );
  };

  useEffect(() => {
    onChange(selected);
  }, [selected]);

  const listableRels: FieldsAndRels = manifest.relations.filter(
    (f) => f.isListable && !f.isHidden
  );

  const listables: FieldsAndRels = ([] as FieldsAndRels)
    .concat(manifest.fields.listables, listableRels)
    .filter(Boolean);
    
  listables.sort((a, b) => a.position - b.position);

  return (
    <>
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
                  colorScheme={isSelected(item) ? "red" : "blue"}
                  onClick={() => {
                    if (isSelected(item)) {
                      handleDeselect(item);
                    } else {
                      handleSelect(item);
                    }
                  }}
                >
                  {isSelected(item) ? "Remove" : "Add"}
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </>
  );
};

export default RelationAdder;

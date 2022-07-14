import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import type { ManifestRelation } from "../../../shared/manifest";
import { fieldValueToString } from "../../utils/funcs/fieldValueToString";
import useManifest from "../../utils/hooks/useManifest";
import FormGenerator from "../FormGenerator";
import RelationAdder from "./RelationAdder";
import type { FieldsAndRels } from "../../pages/ListPage";

interface OwnedRelationsManagerProps {
  moduleName: string;
  modelName: string;
  childName: string;
  value: any[];
  relation: ManifestRelation;
  onChange: (value: any, modifies: any[]) => void;
}

const OwnedRelationsManager: React.FC<OwnedRelationsManagerProps> = ({
  moduleName,
  modelName,
  childName,
  value,
  onChange,
  relation,
}) => {
  const [selected, setSelected] = useState(value || []);
  const [modal, setModal] = useState<boolean>();
  const [onCreation, setOnCreation] = useState<any>({});

  const manifest = useManifest().get({
    moduleName,
    modelName: childName,
  });

  useEffect(() => {
    onChange(selected, []);
  }, [selected]);

  const onClose = () => setModal(undefined);

  const handleAdd = (add: any) => {
    onClose();
    const isAlreadyAdded =
      !selected.find(
        (item) =>
          item === add ||
          (add[relation.relatedBy] &&
            item[relation.relatedBy] === add[relation.relatedBy])
      ) && add[relation.relatedBy];
    if (isAlreadyAdded) {
      return;
    }
    setSelected((prev) => [...prev, add]);
  };

  const handleRemove = (idx: number) => () => {
    setSelected((prev) => prev.filter((_, i) => i !== idx));
  };

  const listableRels: FieldsAndRels = manifest.relations.filter(
    (f) => f.isListable && !f.isHidden
  );

  const listables: FieldsAndRels = ([] as FieldsAndRels)
    .concat(manifest.fields.listables, listableRels)
    .filter(Boolean);

  listables.sort((a, b) => a.position - b.position);

  return (
    <Box>
      <Flex>
        <Button marginRight={2} marginTop={2} onClick={() => setModal(false)}>
          Add {manifest.label}
        </Button>
        <Button marginTop={2} onClick={() => setModal(true)}>
          Create {manifest.label}
        </Button>

        <Modal isOpen={modal === false} onClose={onClose} size="4xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <ModalCloseButton />
            </ModalHeader>
            <ModalBody>
              <RelationAdder
                childName={childName}
                modelName={modelName}
                moduleName={moduleName}
                onChange={setSelected}
                value={selected}
                relation={relation}
              />
              <Button colorScheme="blue" onClick={onClose}>
                Ok
              </Button>
            </ModalBody>
          </ModalContent>
        </Modal>

        <Modal isOpen={modal === true} onClose={onClose} size="4xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <ModalCloseButton />
            </ModalHeader>
            <ModalBody>
              <FormGenerator
                isChild
                moduleName={moduleName}
                modelName={childName}
                onChange={(val) => {
                  setOnCreation(val);
                }}
              />
              <Button
                onClick={() => {
                  handleAdd(onCreation);
                  setOnCreation({});
                }}
              >
                Create
              </Button>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Flex>
      <Table>
        <Thead>
          <Tr>
            {listables.map((field) => (
              <Th key={field.name}>{field.label || field.name}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {selected.map((item, i) => (
            <Tr key={item.id}>
              {listables.map((field) => (
                <Th key={field.name}>
                  {fieldValueToString(field, item[field.name])}
                </Th>
              ))}
              <Th>
                <Button colorScheme="red" onClick={handleRemove(i)}>
                  Delete
                </Button>
              </Th>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default OwnedRelationsManager;

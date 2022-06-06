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
  const { label, fields } = useManifest().get({
    moduleName,
    modelName: childName,
  });
  const [modal, setModal] = useState<boolean>();
  const [onCreation, setOnCreation] = useState<any>({});
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

  return (
    <Box>
      <Flex>
        <Button onClick={() => setModal(false)}>Add {label}</Button>
        <Button onClick={() => setModal(true)}>Create {label}</Button>

        <Modal isOpen={modal === false} onClose={onClose}>
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

        <Modal isOpen={modal === true} onClose={onClose}>
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
            {fields.all.map((field) => (
              <Th key={field.name}>{field.label}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {selected?.map((item, i) => (
            <Tr key={item.id}>
              {fields.all.map((field) => (
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

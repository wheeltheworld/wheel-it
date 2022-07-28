import React, { FormEventHandler, useEffect, useState } from "react";
import { Box, Button, Flex, FormControl, FormLabel } from "@chakra-ui/react";
import type { StringOrNumber } from "@chakra-ui/utils";
import { Link as RouterLink } from "react-router-dom";
import FieldSelector from "./selector/FieldSelector";
import RelationSwitch from "./selector/RelationSwitch";
import useManifest from "../utils/hooks/useManifest";
import type { RelationModifies } from "../utils/funcs/cleanData";

export interface FormGeneratorProps {
  initValues?: any;
  onChange?: (values: any) => void;
  onSubmit?: (values: any, relationModifies: RelationModifies) => void;
  modelName: string;
  moduleName: string;
  isChild?: boolean;
}

const FormGenerator: React.FC<FormGeneratorProps> = ({
  onChange,
  onSubmit,
  initValues,
  modelName,
  moduleName,
  isChild,
}) => {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [data, setData] = useState<Record<string, any>>(initValues || {});
  const [modifies, setModifies] = useState<RelationModifies>({});
  const { fields, relations } = useManifest().get({ moduleName, modelName });

  useEffect(() => {
    onChange?.(data);
  }, [data]);

  const handleChange = (name: StringOrNumber) => (value: any) => {
    setData((data) => ({ ...data, [name]: value }));
  };

  const handleRelationChange =
    (name: string) => (value: any, relationModifies?: any[]) => {
      setData((data) => ({ ...data, [name]: value }));
      if (relationModifies)
        setModifies((modifies) => ({ ...modifies, [name]: relationModifies }));
    };

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault();
    setSubmitted(true);
    onSubmit?.(data, modifies);
  };

  const form = (
    <>
      {fields.all.map(
        (field) =>
          field.showInForm && (
            <FormControl key={field.name}>
              <FormLabel
                marginTop={4}
                marginBottom={1}
                fontWeight="normal"
                color="#232323"
              >
                {field.label || field.name}
              </FormLabel>
              <FieldSelector
                onChange={handleChange(field.name)}
                value={data[field.name]}
                field={field}
                submitted={submitted}
              />
            </FormControl>
          )
      )}
      {relations.map(
        (relation) =>
          relation.showInForm && (
            <RelationSwitch
              key={relation.name}
              relation={relation}
              onChange={handleRelationChange(relation.relationName)}
              value={data[relation.relationName]}
              moduleName={moduleName}
              modelName={modelName}
              childName={relation.name}
            />
          )
      )}
    </>
  );

  if (isChild) {
    return form;
  }

  return (
    <Box width="500px" as="form" onSubmit={handleSubmit}>
      {form}
      <Flex marginTop={8}>
        <Button
          type="submit"
          marginRight={6}
          rounded="md"
          display="block"
          w="fit-content"
          p="10px 20px"
          bgColor="#02B2AD"
          color="white"
          _hover={{ bgColor: "#007187" }}
          _focus={{ bgColor: "#004D5C" }}
          _disabled={{ bgColor: "#02B2AD", opacity: 0.5 }}
        >
          Save
        </Button>
        <Button
          as={RouterLink}
          to={`/_/${moduleName}/${modelName}`}
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
          _disabled={{ bgColor: "#D1F1F0", opacity: 0.5 }}
        >
          Cancel
        </Button>
      </Flex>
    </Box>
  );
};

export default FormGenerator;

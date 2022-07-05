import React, { FormEventHandler, useEffect, useState } from "react";
import { Box, Button, FormControl, FormLabel } from "@chakra-ui/react";
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

  const handleChange = (name: string) => (value: any) => {
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
      {fields.all.map((field) => field.showInForm && (
        <FormControl key={field.name}>
          <FormLabel>{field.label || field.name}</FormLabel>
          <FieldSelector
            onChange={handleChange(field.name)}
            value={data[field.name]}
            field={field}
            submitted={submitted}
          />
        </FormControl>
      ))}
      {relations.map((relation) => relation.showInForm && (
        <RelationSwitch
          key={relation.name}
          relation={relation}
          onChange={handleRelationChange(relation.relationName)}
          value={data[relation.relationName]}
          moduleName={moduleName}
          modelName={modelName}
          childName={relation.name}
        />
      ))}
    </>
  );

  if (isChild) {
    return form;
  }

  return (
    <Box as="form" onSubmit={handleSubmit}>
      {form}
      <Button type="submit">Save</Button>
    </Box>
  );
};

export default FormGenerator;

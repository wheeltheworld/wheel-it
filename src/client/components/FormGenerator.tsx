import React, { FormEventHandler, useEffect, useState } from "react";
import { Box, Button, FormControl, FormLabel } from "@chakra-ui/react";
import DataField from "./DataField";
import type { Field, ManifestChild } from "../../shared/manifest";
import ChildrenAdder from "./fields/ChildrenAdder";

export interface SimpleFormGeneratorProps {
  initValues?: any;
  fields: Field[];
  children: ManifestChild[];
  onChange?: (values: any) => void;
  onSubmit?: (values: any) => void;
  modelName: string;
  moduleName: string;
}

const SimpleFormGenerator: React.FC<SimpleFormGeneratorProps> = ({
  fields,
  onChange,
  onSubmit,
  initValues,
  children,
  modelName,
  moduleName,
}) => {
  const [data, setData] = useState<Record<string, any>>(initValues || {});
  const handleChange = (name: string) => (value: any) => {
    setData({ ...data, [name]: value });
  };

  useEffect(() => {
    onChange?.(data);
  }, [data]);

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();

    onSubmit?.(data);
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      {fields.map((field) => (
        <FormControl key={field.name}>
          <FormLabel>{field.label || field.name}</FormLabel>
          <DataField
            onChange={handleChange(field.name)}
            value={data[field.name]}
            field={field}
          />
        </FormControl>
      ))}
      {children.map((child) => (
        <FormControl key={child.name}>
          <FormLabel>{child.label || child.name}</FormLabel>
          <ChildrenAdder
            modelName={modelName}
            moduleName={moduleName}
            childName={child.name}
            onChange={handleChange(child.name)}
            value={data[child.name]}
          />
        </FormControl>
      ))}
      <Button type="submit">Save</Button>
    </Box>
  );
};

export default SimpleFormGenerator;

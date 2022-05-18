import React, { FormEventHandler, useEffect, useState } from "react";
import { Box, Button, FormControl, FormLabel } from "@chakra-ui/react";
import DataField from "./DataField";
import type { Field } from "../../shared/manifest";
import type { IDate } from "./fields/Date";

interface FormGeneratorProps {
  initValues?: any;
  fields: Field[];
  onChange?: (values: any) => void;
  onSubmit?: (values: any) => void;
}

const curate = (fields: Field[], values: any) => {
  const copy = JSON.parse(JSON.stringify(values));
  for (const field of fields) {
    if (field.type === "date") {
      const value: IDate = copy[field.name];
      if (!value) continue;
      copy[field.name] = new Date(value.year, value.month - 1, value.day);
    }
  }
  return copy;
};

const uncurate = (fields: Field[], values: any) => {
  if (!values) return;
  const copy = JSON.parse(JSON.stringify(values));
  for (const field of fields) {
    if (field.type === "date") {
      let value: Date = copy[field.name];
      if (!value) continue;
      value = new Date(value);
      copy[field.name] = {
        day: value.getDate(),
        month: value.getMonth() + 1,
        year: value.getFullYear(),
      };
    }
  }
  return copy;
};

const FormGenerator: React.FC<FormGeneratorProps> = ({
  fields,
  onChange,
  onSubmit,
  initValues,
}) => {
  const [data, setData] = useState<Record<string, string>>(
    uncurate(fields, initValues) || {}
  );
  const handleChange = (name: string) => (value: any) => {
    setData({ ...data, [name]: value });
  };

  useEffect(() => {
    onChange?.(curate(fields, data));
  }, [data]);

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();

    onSubmit?.(curate(fields, data));
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
      <Button type="submit">Save</Button>
    </Box>
  );
};

export default FormGenerator;

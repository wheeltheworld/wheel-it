import React from "react";
import { Input, Switch } from "@chakra-ui/react";
import type { FieldType } from "../../shared/manifest";

interface DataFieldProps {
  onChange: (value: any) => void;
  value: any;
  type: FieldType;
}

const DataField: React.FC<DataFieldProps> = ({ onChange, value, type }) => {
  switch (type) {
    case "string":
      return <Input onChange={(e) => onChange(e.target.value)} value={value} />;
    case "int":
      return (
        <Input
          type="number"
          onChange={(e) => onChange(Number(e.target.value))}
          value={value}
          step={1}
        />
      );
    case "float":
      return (
        <Input
          type="number"
          onChange={(e) => onChange(Number(e.target.value))}
          value={value}
          step={0.1}
        />
      );
    case "boolean":
      return (
        <Switch onChange={(e) => onChange(e.target.checked)} value={value} />
      );
  }
  return <></>;
};

export default DataField;

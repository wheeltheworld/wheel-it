import React from "react";
import { Input, Switch } from "@chakra-ui/react";

interface DataFieldProps {
  onChange: (value: any) => void;
  value: any;
  type: string;
}

const DataField: React.FC<DataFieldProps> = ({ onChange, value, type }) => {
  switch (type) {
    case "string":
      return <Input onChange={(e) => onChange(e.target.value)} value={value} />;
    case "number":
      return (
        <Input
          type="number"
          onChange={(e) => onChange(Number(e.target.value))}
          value={value}
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

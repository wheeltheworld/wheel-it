import React from "react";
import { Input, Switch } from "@chakra-ui/react";
import type { FieldType } from "../../shared/manifest";
import { useWheel } from "./WheelProvider";

interface DataFieldProps {
  onChange: (value: any) => void;
  value: any;
  type: FieldType;
}

const DataField: React.FC<DataFieldProps> = ({ onChange, value, type }) => {
  const { customInputs } = useWheel();
  const CustomInput = customInputs?.[type];
  if (CustomInput) {
    return <CustomInput onChange={onChange} value={value} />;
  }
  switch (type) {
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
    case "string":
    default:
      return <Input onChange={(e) => onChange(e.target.value)} value={value} />;
  }
};

export default DataField;

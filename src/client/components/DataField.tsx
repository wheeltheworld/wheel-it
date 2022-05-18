import React from "react";
import { Input, Switch } from "@chakra-ui/react";
import type { Field } from "../../shared/manifest";
import { useWheel } from "./WheelProvider";
import Date from "./fields/Date";

interface DataFieldProps {
  onChange: (value: any) => void;
  value: any;
  field: Field;
}

const DataField: React.FC<DataFieldProps> = ({ onChange, value, field }) => {
  const { customInputs } = useWheel();
  const CustomInput = customInputs?.[field.type];
  const commonProps = {
    readOnly: field.isReadonly,
    value,
  };
  if (CustomInput) {
    return <CustomInput onChange={onChange} {...commonProps} />;
  }
  switch (field.type) {
    case "int":
      return (
        <Input
          type="number"
          onChange={(e) =>
            e.target.value ? onChange(Number(e.target.value)) : onChange(null)
          }
          step={1}
          {...commonProps}
        />
      );
    case "float":
      return (
        <Input
          type="number"
          onChange={(e) =>
            e.target.value ? onChange(Number(e.target.value)) : onChange(null)
          }
          step={0.1}
          {...commonProps}
        />
      );
    case "boolean":
      return (
        <Switch onChange={(e) => onChange(e.target.checked)} {...commonProps} />
      );
    case "date":
      return <Date onChange={onChange} {...commonProps} />;
    case "string":
    default:
      return (
        <Input onChange={(e) => onChange(e.target.value)} {...commonProps} />
      );
  }
};

export default DataField;

import React from "react";
import { Input, Switch } from "@chakra-ui/react";
import type { Field } from "../../../shared/manifest";
import { useWheel } from "../WheelProvider";
import Date from "../fields/Date";
import Select from "../fields/Select";
import MultiSelect from "../fields/MultiSelect";

interface FieldSelectorProps {
  onChange: (value: any) => void;
  value: any;
  field: Field;
}

const FieldSelector: React.FC<FieldSelectorProps> = ({
  onChange,
  value,
  field,
}) => {
  const { customInputs } = useWheel();
  const CustomInput = customInputs?.[field.type];
  const commonProps = {
    readOnly: field.isReadonly,
    value,
    onChange,
    options: field.options,
  };
  if (CustomInput) {
    return <CustomInput {...commonProps} />;
  }
  switch (field.type) {
    case "int":
      return (
        <Input
          type="number"
          step={1}
          {...commonProps}
          onChange={(e) =>
            e.target.value ? onChange(Number(e.target.value)) : onChange(null)
          }
        />
      );
    case "float":
      return (
        <Input
          type="number"
          step={0.1}
          {...commonProps}
          onChange={(e) =>
            e.target.value ? onChange(Number(e.target.value)) : onChange(null)
          }
        />
      );
    case "boolean":
      return (
        <Switch {...commonProps} onChange={(e) => onChange(e.target.checked)} />
      );
    case "date":
      return <Date {...commonProps} />;
    case "select":
      return <Select {...commonProps} />;
    case "multiselect":
      return <MultiSelect {...commonProps} />;
    case "string":
    default:
      return (
        <Input {...commonProps} onChange={(e) => onChange(e.target.value)} />
      );
  }
};

export default FieldSelector;

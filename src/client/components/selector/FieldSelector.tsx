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
  submitted: boolean;
  field: Field;
}

const FieldSelector: React.FC<FieldSelectorProps> = ({
  onChange,
  value,
  field,
  submitted,
}) => {
  const { customInputs } = useWheel();
  const CustomInput = customInputs?.[field.type];
  const readOnlyProps = field.isReadonly
    ? {
        opacity: 0.4,
        cursor: "default",
        outline: 0,
        border: 0,
      }
    : {};
  const commonProps = {
    readOnly: field.isReadonly,
    isRequired: field.isRequired,
    value,
    onChange,
    options: field.options,
    ...readOnlyProps,
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
    case "email":
      return (
        <Input
          type="email"
          {...commonProps}
          onChange={(e) => onChange(e.target.value)}
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
      return <MultiSelect {...commonProps} submitted={submitted} />;
    case "string":
    default:
      return (
        <Input {...commonProps} onChange={(e) => onChange(e.target.value)} />
      );
  }
};

export default FieldSelector;

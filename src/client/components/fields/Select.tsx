import React, { useEffect } from "react";
import { Select as ChakraSelect } from "@chakra-ui/react";
import type { Option } from "../../../shared/manifest";

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  readOnly: boolean;
  isRequired: boolean;
  options: Option[];
}

const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  readOnly,
  isRequired,
  options,
}) => {
  const readOnlyProps = readOnly
    ? {
        opacity: 0.4,
        cursor: "default",
        outline: 0,
        border: 0,
      }
    : {};

  useEffect(() => {
    if (!value) {
      onChange(options[0]?.value);
    }
  }, []);

  return (
    <>
      <ChakraSelect
        value={value}
        onChange={(e) => onChange(e.target.value)}
        isReadOnly={readOnly}
        isRequired={isRequired}
        {...readOnlyProps}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </ChakraSelect>
    </>
  );
};

export default Select;

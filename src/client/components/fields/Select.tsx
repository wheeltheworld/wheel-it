import React, { useEffect } from "react";
import { Select as ChakraSelect } from "@chakra-ui/react";
import type { Option } from "../../../shared/manifest";

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  readOnly: boolean;
  options: Option[];
}

const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  readOnly,
  options,
}) => {
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

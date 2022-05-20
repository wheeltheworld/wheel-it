import React from "react";
import { Checkbox, CheckboxGroup, Stack } from "@chakra-ui/react";
import type { Option } from "../../../shared/manifest";

interface SelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  readOnly: boolean;
  options: Option[];
}

const MultiSelect: React.FC<SelectProps> = ({
  value,
  onChange,
  readOnly,
  options,
}) => {
  return (
    <>
      <CheckboxGroup colorScheme="blue" value={value} onChange={onChange}>
        <Stack spacing={[1, 5]} direction={["column", "row"]}>
          {options.map((option) => (
            <Checkbox
              value={option.value}
              key={option.value}
              readOnly={readOnly}
            >
              {option.value}
            </Checkbox>
          ))}
        </Stack>
      </CheckboxGroup>
    </>
  );
};

export default MultiSelect;

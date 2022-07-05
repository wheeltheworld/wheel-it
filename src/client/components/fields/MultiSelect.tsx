import React, { useEffect, useState } from "react";
import { Box, Checkbox, CheckboxGroup, Stack } from "@chakra-ui/react";
import type { StringOrNumber } from "@chakra-ui/utils";
import type { Option } from "../../../shared/manifest";

interface SelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  readOnly: boolean;
  isRequired: boolean;
  submitted: boolean;
  options: Option[];
}

const MultiSelect: React.FC<SelectProps> = ({
  value,
  onChange,
  readOnly,
  isRequired,
  options,
  submitted,
}) => {
  const [valueGroup, setValueGroup] = useState<StringOrNumber[]>(value || []);
  const [error, setError] = useState<string>("");
  const [shouldShowError, setShouldShowError] = useState(false);

  const handleChange = (value: StringOrNumber[]) => {
    setValueGroup(value);
  };

  useEffect(() => {
    if (!submitted) return;
    if (valueGroup.length === 0 && isRequired) {
      setShouldShowError(true);
      setError("Please select at least an option");
    } else {
      setShouldShowError(false);
      onChange?.(value);
    }
  }, [valueGroup, submitted]);

  return (
    <>
      <CheckboxGroup colorScheme="blue" value={value} onChange={handleChange}>
        <Stack spacing={[1, 5]} direction={["column", "row"]}>
          {options.map((option) => (
            <Checkbox
              value={option.value}
              key={option.value}
              readOnly={readOnly}
            >
              {option.label}
            </Checkbox>
          ))}
        </Stack>
      </CheckboxGroup>
      {shouldShowError && error && <Box color="red.500">{error}</Box>}
    </>
  );
};

export default MultiSelect;

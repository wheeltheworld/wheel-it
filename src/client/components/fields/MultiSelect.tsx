import React, { useEffect, useState } from "react";
import { Box, Checkbox, CheckboxGroup, Stack, Text } from "@chakra-ui/react";
import type { StringOrNumber } from "@chakra-ui/utils";
import type { Option } from "../../../shared/manifest";

interface SelectProps {
  value: string[];
  onChange: (value: StringOrNumber[]) => void;
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
  const readOnlyProps = readOnly
    ? {
        opacity: 0.4,
        cursor: "default",
        outline: 0,
        border: 0,
      }
    : {};

  const [valueGroup, setValueGroup] = useState<StringOrNumber[]>(value || []);
  const [error, setError] = useState<string>("");
  const [blocked, setBlocked] = useState<boolean>(true);
  const [shouldShowError, setShouldShowError] = useState(false);

  const handleChange = (value: StringOrNumber[]) => {
    setBlocked(false);
    setValueGroup(value);
  };

  useEffect(() => {
    if (blocked && !submitted) return;
    if (valueGroup.length === 0 && isRequired) {
      setShouldShowError(true);
      setError("Please select at least an option");
    } else {
      setShouldShowError(false);
      onChange(valueGroup);
    }
  }, [valueGroup, blocked, submitted]);

  return (
    <>
      <CheckboxGroup colorScheme="blue" value={value} onChange={handleChange}>
        <Stack spacing={[1, 0]} direction={["column", "row"]} wrap="wrap">
          {options.map((option) => (
            <Checkbox
              value={option.value}
              key={option.value}
              readOnly={readOnly}
              {...readOnlyProps}
            >
              <Text marginRight={6} marginY={2}>
                {option.label}
              </Text>
            </Checkbox>
          ))}
        </Stack>
      </CheckboxGroup>
      {shouldShowError && error && <Box color="red.500">{error}</Box>}
    </>
  );
};

export default MultiSelect;

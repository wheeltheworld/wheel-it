import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Child, useChildSearch } from "../../utils/hooks/useChildSearch";

interface ChildSelector {
  modelName: string;
  moduleName: string;
  childName: string;
  onChange?: (value: string | number | null) => void;
  value?: Child;
}

const ChildSelector: React.FC<ChildSelector> = ({
  modelName,
  moduleName,
  childName,
  value,
  onChange,
}) => {
  const [child, setChild] = useState<Child | undefined>(value);
  const { search, onSearch, onClear, options } = useChildSearch({
    modelName,
    moduleName,
    childName,
  });

  useEffect(() => {
    onChange?.(child?.value || null);
  }, [child]);

  const handleRemove = () => {
    setChild(undefined);
  };

  const handleAdd = (option: Child) => () => {
    setChild(option);
    onClear();
  };

  if (child) {
    return (
      <Flex>
        <Text
          key={child.value}
          bgColor="gray.100"
          borderRadius="7px"
          m="5px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap="5px"
        >
          {child.label}
          <Button
            onClick={handleRemove}
            fontSize="16px"
            variant="ghost"
            borderRadius="100%"
          >
            x
          </Button>
        </Text>
      </Flex>
    );
  }

  return (
    <Box position="relative">
      <Input value={search} onChange={(e) => onSearch(e.target.value)} />
      <Flex
        position="absolute"
        direction="column"
        borderRadius="10px"
        zIndex={10}
      >
        {options.map((option) => (
          <Button
            key={option.value}
            onClick={handleAdd(option)}
            borderRadius="0"
          >
            {option.label}
          </Button>
        ))}
      </Flex>
    </Box>
  );
};

export default ChildSelector;

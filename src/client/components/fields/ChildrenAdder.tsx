import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Child, useChildSearch } from "../../utils/hooks/useChildSearch";

interface ChildrenAdderProps {
  modelName: string;
  moduleName: string;
  childName: string;
  onChange?: (value: (string | number)[]) => void;
  value?: Child[];
}

const ChildrenAdder: React.FC<ChildrenAdderProps> = ({
  modelName,
  moduleName,
  childName,
  value,
  onChange,
}) => {
  const [children, setChildren] = useState<Child[]>(value || []);
  const { search, onSearch, onClear, options } = useChildSearch({
    modelName,
    moduleName,
    childName,
  });

  useEffect(() => {
    onChange?.(children.map((child) => child.value));
  }, [children]);

  const handleRemove = (option: Child) => () => {
    setChildren((children) =>
      children.filter((child) => child.value !== option.value)
    );
  };

  const handleAdd = (option: Child) => () => {
    if (!children.find((child) => child.value === option.value)) {
      setChildren((children) => [...children, option]);
      onClear();
    }
  };

  return (
    <Box position="relative">
      <Flex>
        {children.map((child) => (
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
              onClick={handleRemove(child)}
              fontSize="16px"
              variant="ghost"
              borderRadius="100%"
            >
              x
            </Button>
          </Text>
        ))}
      </Flex>
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

export default ChildrenAdder;

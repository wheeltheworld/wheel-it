import { Button, Flex, Select, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { range } from "../utils/funcs/range";

interface Page {
  number: number;
  amount: number;
}

interface PaginatorProps {
  pages: number;
  page: number;
  onChange: (page: Page) => void;
  withAmount?: boolean;
}

/**
 * Allows the user to naviagate through a pagination
 * without needing to display all the pages links.
 */
const Paginator: React.FC<PaginatorProps> = ({
  pages: max,
  page,
  onChange,
  withAmount = true,
}) => {
  const [amount, setAmount] = useState(25);
  const [current, setCurrent] = useState(page - 1 || 0);

  const pages = range(0, max);

  const inputCommonProps = {
    borderColor: "#949494",
    _disabled: { borderColor: "#E5E5E5" },
    _hover: { borderColor: "#575757" },
    _focus: {
      borderColor: "#575757",
      boxShadow: "0 0 0 1px #575757",
    },
  };

  useEffect(() => {
    onChange({ number: current + 1, amount });
  }, [current, amount]);

  return (
    <Flex sx={{ gap: "10px" }}>
      {pages.map((page, i) =>
        typeof page === "string" ? (
          <Text key={i} alignSelf="flex-end">
            {page}
          </Text>
        ) : (
          <Button
            key={page}
            onClick={() => setCurrent(page)}
            bgColor={current === page ? "#D1F1F0" : "gray.100"}
            color={current === page ? "#007187" : "gray.700"}
            fontWeight={800}
            textDecoration="none"
            boxSize="40px"
            borderRadius="8px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {page + 1}
          </Button>
        )
      )}
      {withAmount && (
        <Select
          width="unset"
          flexShrink={0}
          onChange={(e) => {
            setAmount(Number(e.target.value));
            setCurrent(0);
          }}
          {...inputCommonProps}
        >
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </Select>
      )}
    </Flex>
  );
};

export default Paginator;

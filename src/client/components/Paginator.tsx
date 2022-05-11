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
}

/**
 * Allows the user to naviagate through a pagination
 * without needing to display all the pages links.
 */
const Paginator: React.FC<PaginatorProps> = ({
  pages: max,
  page,
  onChange,
}) => {
  const [amount, setAmount] = useState(25);
  const [current, setCurrent] = useState(page - 1 || 0);

  const pages = range(0, max);

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
            bgColor={current === page ? "blue.500" : "gray.100"}
            color={current === page ? "white" : "gray.700"}
            boxSize="40px"
            borderRadius="8px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            key={page}
            onClick={() => setCurrent(page)}
          >
            {page + 1}
          </Button>
        )
      )}
      <Select
        onChange={(e) => {
          setAmount(Number(e.target.value));
          setCurrent(0);
        }}
      >
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </Select>
    </Flex>
  );
};

export default Paginator;

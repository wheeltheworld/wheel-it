import { Box, Link } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import React from "react";
import { useNav } from "../utils/hooks/useNav";

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
  const items = useNav();
  console.log({ items });
  return (
    <Box p="50px" borderBottom="1px solid lightgray" mb="30px" mx="50px">
      {items.map((item) =>
        item.children ? (
          <Box key={item.path}>
            {item.children.map((child) => (
              <Link as={RouterLink} to={child.path || "/"}>
                {child.label}
              </Link>
            ))}
          </Box>
        ) : (
          <Link as={RouterLink} to={item.path || "/"}>
            {item.label}
          </Link>
        )
      )}
    </Box>
  );
};

export default Navbar;

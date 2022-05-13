import { Box, Link } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import React from "react";
import { useNav } from "../utils/hooks/useNav";

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
  const items = useNav();
  return (
    <Box>
      {items.map((item) =>
        item.children ? (
          <Box key={item.path}>
            {items.map((item) => (
              <Link as={RouterLink} to={item.path || "/"}>
                {item.label}
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

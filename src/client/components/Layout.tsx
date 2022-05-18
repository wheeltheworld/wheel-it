import { Box } from "@chakra-ui/react";
import React, { PropsWithChildren } from "react";
import Navbar from "./Navbar";

interface LayoutProps {}

const Layout: React.FC<PropsWithChildren<LayoutProps>> = ({ children }) => {
  return (
    <>
      <Navbar />
      <Box p="50px">{children}</Box>
    </>
  );
};

export default Layout;

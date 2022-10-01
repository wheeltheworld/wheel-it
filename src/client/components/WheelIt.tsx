import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import { BrowserRouter, Routes } from "react-router-dom";
import { useRoutes } from "../utils/hooks/useRoutes";

interface WheelItProps {}

const WheelIt: React.FC<WheelItProps> = ({}) => {
  const routes = useRoutes({ withNotFound: true });
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>{routes}</Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
};

export default WheelIt;

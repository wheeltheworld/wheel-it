import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import { BrowserRouter, Switch } from "react-router-dom";
import { useRoutes } from "../utils/hooks/useRoutes";

interface WheelItProps {}

const WheelIt: React.FC<WheelItProps> = ({}) => {
  const routes = useRoutes({ withNotFound: true });
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Switch>{routes}</Switch>
      </BrowserRouter>
    </ChakraProvider>
  );
};

export default WheelIt;

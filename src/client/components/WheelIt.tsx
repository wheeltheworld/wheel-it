import React from "react";
import { BrowserRouter, Switch } from "react-router-dom";
import { useRoutes } from "../utils/hooks/useRoutes";
import Layout from "./Layout";
import WheelProvider from "./WheelProvider";

interface WheelItProps {}

const WheelIt: React.FC<WheelItProps> = ({}) => {
  const routes = useRoutes();
  return (
    <WheelProvider pageWrapper={Layout}>
      <BrowserRouter>
        <Switch>{routes}</Switch>
      </BrowserRouter>
    </WheelProvider>
  );
};

export default WheelIt;

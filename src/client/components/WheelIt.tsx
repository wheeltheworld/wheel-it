import React from "react";
import { Switch } from "react-router-dom";
import { useRoutes } from "../utils/hooks/useRoutes";
import Layout from "./Layout";
import WheelProvider from "./WheelProvider";

interface WheelItProps {}

const WheelIt: React.FC<WheelItProps> = ({}) => {
  const routes = useRoutes();
  return (
    <WheelProvider pageWrapper={Layout}>
      <Switch>{routes}</Switch>
    </WheelProvider>
  );
};

export default WheelIt;

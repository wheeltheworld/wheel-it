import React from "react";
import Layout from "./Layout";
import WheelIt from "./WheelIt";
import WheelProvider from "./WheelProvider";

interface WheelItWrapperProps {}

const WheelItWrapper: React.FC<WheelItWrapperProps> = ({}) => {
  return (
    <WheelProvider pageWrapper={Layout}>
      <WheelIt />
    </WheelProvider>
  );
};

export default WheelItWrapper;

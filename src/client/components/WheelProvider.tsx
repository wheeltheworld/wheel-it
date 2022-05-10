import React, { createContext, PropsWithChildren, useContext } from "react";

interface WheelCTX {
  pageWrapper?: React.ComponentType<PropsWithChildren<{}>>;
}

const wheelCTX = createContext<WheelCTX>({});

export const useWheel = () => useContext(wheelCTX);

const WheelProvider: React.FC<PropsWithChildren<WheelCTX>> = (props) => {
  return <wheelCTX.Provider value={props}>{props.children}</wheelCTX.Provider>;
};

export default WheelProvider;

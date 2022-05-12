import React, { createContext, PropsWithChildren, useContext } from "react";
import type { CustomInput } from "../utils/types/CustomInput";

interface WheelCTX {
  pageWrapper?: React.ComponentType<PropsWithChildren<{}>>;
  customInputs?: Record<string, CustomInput>;
}

const wheelCTX = createContext<WheelCTX>({});

export const useWheel = () => useContext(wheelCTX);

const WheelProvider: React.FC<PropsWithChildren<WheelCTX>> = (props) => {
  return <wheelCTX.Provider value={props}>{props.children}</wheelCTX.Provider>;
};

export default WheelProvider;

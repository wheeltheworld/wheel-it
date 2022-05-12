import React, { createContext, PropsWithChildren, useContext } from "react";
import type { CustomInput } from "../utils/types/CustomInput";
import type { IconResolver } from "../utils/types/IconResolver";

interface WheelCTX {
  pageWrapper?: React.ComponentType<PropsWithChildren<{}>>;
  iconResolver?: IconResolver;
  customInputs?: Record<string, CustomInput>;
}

const wheelCTX = createContext<WheelCTX>({});

export const useWheel = () => useContext(wheelCTX);

const WheelProvider: React.FC<PropsWithChildren<WheelCTX>> = (props) => {
  return <wheelCTX.Provider value={props}>{props.children}</wheelCTX.Provider>;
};

export default WheelProvider;

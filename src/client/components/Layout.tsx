import React, { PropsWithChildren } from "react";
import Navbar from "./Navbar";

interface LayoutProps {}

const Layout: React.FC<PropsWithChildren<LayoutProps>> = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default Layout;

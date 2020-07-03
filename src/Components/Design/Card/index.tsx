import React from "react";

const Card: React.FC<{ children }> = ({ children }) => {
  return <div style={{ backgroundColor: "red" }}>{children}</div>;
};

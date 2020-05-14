import React from "react";

const Margin: React.FC<{ children }> = ({ children }) => {
  return <div style={{ margin: 15 }}>{children}</div>;
};

export default Margin;

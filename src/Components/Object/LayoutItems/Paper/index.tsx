import React from "react";
import Card from "../../../Design/Card";

const ObjectLayoutItemPaper: React.FC<{ children }> = ({ children }) => {
  return <Card hoverable>{children}</Card>;
};

export default ObjectLayoutItemPaper;

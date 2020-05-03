import React from "react";
import { Paper } from "@material-ui/core";

const ObjectLayoutItemPaper: React.FC<{ children }> = ({ children }) => {
  return <Paper className="paper">{children}</Paper>;
};

export default ObjectLayoutItemPaper;

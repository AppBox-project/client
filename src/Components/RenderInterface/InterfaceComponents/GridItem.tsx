import { Grid } from "@material-ui/core";
import React from "react";

const RenderInterfaceGridItem: React.FC<{ children }> = ({ children }) => {
  return <Grid item>{children}</Grid>;
};

export default RenderInterfaceGridItem;

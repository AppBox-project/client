import { Grid } from "@material-ui/core";
import React from "react";

const RenderInterfaceGridContainer: React.FC<{ children }> = ({ children }) => {
  return <Grid container>{children}</Grid>;
};

export default RenderInterfaceGridContainer;

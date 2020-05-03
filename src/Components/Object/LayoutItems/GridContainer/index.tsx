import React from "react";
import { Grid } from "@material-ui/core";

const ObjectLayoutItemGridContainer: React.FC<{ children }> = ({
  children,
}) => {
  return <Grid container>{children}</Grid>;
};

export default ObjectLayoutItemGridContainer;

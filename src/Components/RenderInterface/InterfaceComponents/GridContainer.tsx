import { Grid, GridSpacing } from "@material-ui/core";
import React from "react";

const RenderInterfaceGridContainer: React.FC<{
  children;
  spacing: GridSpacing;
}> = ({ children, spacing }) => {
  return (
    <Grid container spacing={spacing || 0}>
      {children}
    </Grid>
  );
};

export default RenderInterfaceGridContainer;

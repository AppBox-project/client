import { Grid } from "@material-ui/core";
import React from "react";

const RenderInterfaceGridItem: React.FC<{
  children;
  xs?;
  sm?;
  md?;
  lg?;
  xl?;
}> = ({ children, xs, sm, md, lg, xl }) => {
  return (
    <Grid item xs={xs} sm={sm} md={md} lg={lg} xl={xl}>
      {children}
    </Grid>
  );
};

export default RenderInterfaceGridItem;

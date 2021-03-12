import React from "react";
import { Grid, GridSize } from "@material-ui/core";

const ObjectLayoutItemGridItem: React.FC<{
  children;
  xs?: GridSize;
  sm?: GridSize;
  md?: GridSize;
  lg?: GridSize;
  xl?: GridSize;
  scrollIndependently?: boolean;
}> = ({ children, xs, sm, md, lg, xl, scrollIndependently }) => {
  return (
    <Grid
      item
      xs={xs}
      sm={sm}
      md={md}
      lg={lg}
      xl={xl}
      className={scrollIndependently && "scrollIndependently"}
    >
      {children}
    </Grid>
  );
};

export default ObjectLayoutItemGridItem;

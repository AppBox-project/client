import React from "react";
import { Skeleton } from "@material-ui/lab";
import { Grid } from "@material-ui/core";

const GridItemLayoutSkeleton: React.FC = () => {
  return (
    <Grid container>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(() => (
        <Grid item xs={3} style={{ boxSizing: "border-box", padding: 15 }}>
          <Skeleton variant="rect" width="100%" height={250} />
        </Grid>
      ))}
    </Grid>
  );
};

export default GridItemLayoutSkeleton;

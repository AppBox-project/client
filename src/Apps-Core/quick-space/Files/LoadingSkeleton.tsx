import React from "react";
import { Grid, List, ListItem } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

const AppQSActionFileLoadingSkeleton: React.FC = () => {
  return (
    <Grid container style={{ height: "100%" }}>
      <Grid item style={{ height: "100%" }} xs={3}>
        <List>
          <ListItem>
            <Skeleton variant="text" style={{ width: "100%" }} />
          </ListItem>
          <ListItem>
            <Skeleton variant="text" style={{ width: "100%" }} />
          </ListItem>
          <ListItem>
            <Skeleton variant="text" style={{ width: "100%" }} />
          </ListItem>
          <ListItem>
            <Skeleton variant="text" style={{ width: "100%" }} />
          </ListItem>
          <ListItem>
            <Skeleton variant="text" style={{ width: "100%" }} />
          </ListItem>
          <ListItem>
            <Skeleton variant="text" style={{ width: "100%" }} />
          </ListItem>
          <ListItem>
            <Skeleton variant="text" style={{ width: "100%" }} />
          </ListItem>
          <ListItem>
            <Skeleton variant="text" style={{ width: "100%" }} />
          </ListItem>
          <ListItem>
            <Skeleton variant="text" style={{ width: "100%" }} />
          </ListItem>
          <ListItem>
            <Skeleton variant="text" style={{ width: "100%" }} />
          </ListItem>
          <ListItem>
            <Skeleton variant="text" style={{ width: "100%" }} />
          </ListItem>
          <ListItem>
            <Skeleton variant="text" style={{ width: "100%" }} />
          </ListItem>
          <ListItem>
            <Skeleton variant="text" style={{ width: "100%" }} />
          </ListItem>
        </List>
      </Grid>
      <Grid item xs={9}>
        <Skeleton variant="text" height={400} />
      </Grid>
    </Grid>
  );
};

export default AppQSActionFileLoadingSkeleton;

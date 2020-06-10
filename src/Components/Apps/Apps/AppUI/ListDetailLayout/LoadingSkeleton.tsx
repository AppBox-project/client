import React from "react";
import { List, ListItem } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

const ListDetailLayoutSkeleton: React.FC = () => {
  return (
    <List>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
        <ListItem key={item} style={{ marginBottom: 15 }}>
          <Skeleton width="100%" />
        </ListItem>
      ))}
    </List>
  );
};

export default ListDetailLayoutSkeleton;

import React from "react";
import { List, ListItem, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

const ListDetailLayoutSkeleton: React.FC<{
  title: string;
  description?: string;
}> = ({ title, description }) => {
  return (
    <>
      <Typography
        variant="h6"
        color="primary"
        style={{ textAlign: "center" }}
        gutterBottom
      >
        {title}
      </Typography>
      {description && (
        <Typography
          variant="h6"
          color="primary"
          style={{ textAlign: "center" }}
          gutterBottom
        >
          {description}
        </Typography>
      )}
      <List>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
          <ListItem key={item} style={{ marginBottom: 15 }}>
            <Skeleton width="100%" />
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default ListDetailLayoutSkeleton;

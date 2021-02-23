import { List, ListItem, ListItemText, ListSubheader } from "@material-ui/core";
import React from "react";
import { ObjectType } from "../../../Utils/Types";
import { get } from "lodash";

const RenderInterfaceList: React.FC<{
  title?: string;
  list: any[];
  primary?: string;
  secondary?: string;
}> = ({ title, list, primary, secondary }) => {
  return (
    <List>
      {title && <ListSubheader>{title}</ListSubheader>}
      {list.map((item: ObjectType) => (
        <ListItem key={item._id}>
          <ListItemText
            primary={primary ? get(item, primary) : "error"}
            secondary={secondary && get(item, secondary)}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default RenderInterfaceList;

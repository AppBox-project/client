import { List, ListItem, ListItemText, ListSubheader } from "@material-ui/core";
import React from "react";
import { ObjectType } from "../../../Utils/Types";
import get from "lodash/get";

import formula from "../../../Utils/Functions/ClientFormula";
import { useHistory } from "react-router-dom";

const RenderInterfaceList: React.FC<{
  title?: string;
  list: any[];
  primary?: string;
  secondary?: string;
  linkTo: string;
}> = ({ title, list, primary, secondary, linkTo }) => {
  // Vars
  const history = useHistory();
  // UI
  return (
    <List>
      {title && <ListSubheader>{title}</ListSubheader>}
      {list.map((item: ObjectType) => (
        <ListItem
          key={item._id}
          /*@ts-ignore */
          button={linkTo !== undefined}
          onClick={
            linkTo
              ? async () => {
                  history.push(await formula(linkTo, { ...item }));
                }
              : () => {}
          }
        >
          <ListItemText
            primary={primary ? get(item, primary) : "error"}
            secondary={
              secondary && (
                <div
                  dangerouslySetInnerHTML={{ __html: get(item, secondary) }}
                />
              )
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default RenderInterfaceList;

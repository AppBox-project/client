import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import React from "react";
import { AppContextType } from "../../../Utils/Types";
import { ActionType } from "../Types";
import { map } from "lodash";
import { FaPlus } from "react-icons/fa";

const SettingsActionsVars: React.FC<{
  context: AppContextType;
  action: ActionType;
  setAction;
}> = ({ context, action, setAction }) => (
  <List disablePadding>
    {map(action?.data?.data?.vars, (v, key) => (
      <ListItem key={key}>
        <ListItemText>{v.name}</ListItemText>
      </ListItem>
    ))}
    <ListItem button>
      <ListItemIcon style={{ minWidth: 32 }}>
        <FaPlus />
      </ListItemIcon>
      <ListItemText>Create new variable</ListItemText>
    </ListItem>
  </List>
);

export default SettingsActionsVars;

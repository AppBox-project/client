import React, { useState } from "react";
import {
  TypeType,
  UIType,
  AppContextType,
} from "../../../../../../Utils/Types";
import {
  Paper,
  Grid,
  Typography,
  List,
  ListItemText,
  ListItem,
} from "@material-ui/core";

const AppActionManageObjectTabPermissions: React.FC<{
  model: TypeType;
  UI: UIType;
  context: AppContextType;
}> = ({ model, UI, context }) => {
  // Global
  const permissions = [
    {
      key: "read",
      label: "Read",
      description: "Allows the user to read all data.",
    },
    {
      key: "create",
      label: "Create",
      description: "Allows the user to create new entries.",
    },
    {
      key: "modifyOwn",
      label: "Modify (own)",
      description: "Allows the user to modify entries they've made themselves.",
    },
    {
      key: "write",
      label: "Write",
      description: "Gives the user full write permission.",
    },
    {
      key: "delete",
      label: "Delete",
      description: "Gives the user full delete permissions",
    },
    {
      key: "deleteOwn",
      label: "Delete (own)",
      description: "Allows the user to delete entries they've made themselves",
    },
  ];
  // States & Hooks

  // UI
  return (
    <UI.AnimationContainer>
      <Grid container style={{ marginTop: 15 }}>
        {permissions.map((permission) => {
          return (
            <Grid item xs={12} md={6} lg={2} key={permission.key}>
              <UI.AnimationItem>
                <AppActionManageObjectTabPermissionUI
                  permission={permission}
                  groupList={model.permissions[permission.key]}
                  UI={UI}
                />
              </UI.AnimationItem>
            </Grid>
          );
        })}
      </Grid>
    </UI.AnimationContainer>
  );
};

const AppActionManageObjectTabPermissionUI: React.FC<{
  permission: { key: string; label: string; description: string };
  groupList: [string];
  UI: UIType;
}> = ({ permission, groupList, UI }) => {
  return (
    <Paper className="paper" style={{ margin: "0 10px 0 10px" }}>
      <Typography variant="h6">{permission.label}</Typography>
      <Typography variant="subtitle2">{permission.description}</Typography>
      <List>
        {groupList.length > 0 ? (
          groupList.map((group) => {
            return <UI.Forms.TextInput label="Group" value={group} />;
          })
        ) : (
          <ListItem>
            <ListItemText>No groups have this permission</ListItemText>
          </ListItem>
        )}
        <ListItem button>
          <ListItemText></ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};

export default AppActionManageObjectTabPermissions;

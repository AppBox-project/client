import React, { useState, useEffect } from "react";
import {
  ModelType,
  UIType,
  AppContextType,
} from "../../../../../../Utils/Types";
import { Grid, Typography, Button } from "@material-ui/core";
import InputSelect from "../../../../../../Components/Inputs/Select";

const permissionTypes = [
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
  {
    key: "archive",
    label: "Archive",
    description: "Allows the user full archivation permissions",
  },
  {
    key: "archiveOwn",
    label: "Archive (own)",
    description: "Allows the user to archive entries they've made themselves",
  },
];
const AppActionManageObjectTabPermissions: React.FC<{
  model: ModelType;
  UI: UIType;
  context: AppContextType;
}> = ({ model, UI, context }) => {
  // Vars
  const [permissions, setPermissions] = useState<any>(model.permissions);
  const [permissionOptions, setPermissionOptions] = useState<any>();

  // States & Hooks
  useEffect(() => {
    setPermissions(model.permissions);
    context.getObjects("permissions", {}, (response) => {
      if (response.success) {
        const newPermissions = [
          { label: "public", value: "public" },
          { label: "known", value: "known" },
        ];
        response.data.map((r) => {
          newPermissions.push({ label: r.data.name, value: r.data.name });
        });
        setPermissionOptions(newPermissions);
      } else {
        console.log(response);
      }
    });
  }, [model]);

  // UI
  return (
    <UI.Animations.AnimationContainer>
      <Grid container style={{ marginTop: 15 }}>
        {permissionTypes.map((type) => {
          return (
            <Grid item xs={12} md={6} lg={2} key={type.key}>
              <UI.Animations.AnimationItem>
                <AppActionManageObjectTabPermissionUI
                  permission={type}
                  permissions={permissions}
                  setPermissions={setPermissions}
                  UI={UI}
                  permissionOptions={permissionOptions}
                />
              </UI.Animations.AnimationItem>
            </Grid>
          );
        })}
        {permissions !== model.permissions && (
          <Grid item xs={12} style={{ marginTop: 15 }}>
            <UI.Animations.AnimationItem>
              <Button
                fullWidth
                color="primary"
                onClick={() => {
                  context.updateModel(
                    model.key,
                    {
                      ...model,
                      permissions,
                    },
                    model._id
                  );
                }}
              >
                Save
              </Button>
            </UI.Animations.AnimationItem>
          </Grid>
        )}
      </Grid>
    </UI.Animations.AnimationContainer>
  );
};

const AppActionManageObjectTabPermissionUI: React.FC<{
  permission: { key: string; label: string; description: string };
  permissions;
  setPermissions;
  UI: UIType;
  permissionOptions;
}> = ({ permission, UI, permissions, setPermissions, permissionOptions }) => {
  // Vars

  // UI
  return (
    <UI.Design.Card withBigMargin title={permission.label} overflow="auto">
      <Typography variant="subtitle2">{permission.description}</Typography>
      <InputSelect
        label={permission.label}
        options={permissionOptions}
        multiple
        value={permissions[permission.key]}
        onChange={(value) => {
          setPermissions({
            ...permissions,
            [permission.key]: value || ["known"],
          });
        }}
      />
    </UI.Design.Card>
  );
};

export default AppActionManageObjectTabPermissions;

import { Button, Divider, Typography } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { AppContextType, ModelType } from "../../../Utils/Types";
import { ActionType, ActionVarType } from "../Types";
import map from "lodash/map";
import find from "lodash/find";
import { useHistory } from "react-router-dom";

const SettingsActionsSettings: React.FC<{
  context: AppContextType;
  action: ActionType;
  setAction;
  models: ModelType[];
}> = ({ context, action, setAction, models }) => {
  // Vars
  const [settingList, setSettingList] = useState<{
    [varId: string]: ActionVarType;
  }>();
  const history = useHistory();

  const updateAction = (settingKey, newVal) =>
    setAction({
      ...action,
      data: {
        ...action.data,
        data: {
          ...action.data.data,
          vars: {
            ...action.data.data.vars,
            [settingKey]: {
              ...action.data.data.vars[settingKey],
              setting_value: newVal,
            },
          },
        },
      },
    });

  // Lifecycle
  useEffect(() => {
    const no: {
      [varId: string]: ActionVarType;
    } = {};
    map(action?.data?.data?.vars || {}, (v, k) => {
      if (v.setting) {
        no[k] = v;
      }
    });
    setSettingList(no);
  }, [action]);

  // UI
  if (!settingList || !models) return <context.UI.Loading />;

  return (
    <>
      <Typography variant="h6">About</Typography>
      <context.UI.Inputs.TextInput
        label="Name"
        value={action.data.name}
        onChange={(name: string) =>
          setAction({
            ...action,
            data: { ...action.data, name },
          })
        }
      />
      <context.UI.Inputs.TextInput
        label="Icon"
        value={action.data.icon}
        onChange={(icon: string) =>
          setAction({
            ...action,
            data: { ...action.data, icon },
          })
        }
      />
      <context.UI.Inputs.Switch
        label="Active"
        value={action.data.active}
        onChange={(active) =>
          setAction({
            ...action,
            data: { ...action.data, active },
          })
        }
      />
      <Divider />
      <Typography variant="h6">Tweaks</Typography>
      <Typography variant="body1">
        Settings are easy to tweak options that influence how this action runs.
      </Typography>
      {Object.keys(settingList).length < 1 && (
        <Typography variant="body2">
          This action has no tweaks available.
        </Typography>
      )}
      {map(settingList, (setting, settingKey) => {
        switch (setting.type) {
          case "boolean":
            return (
              <context.UI.Inputs.Switch
                label={setting.label}
                value={setting.setting_value}
                onChange={(newVal) => updateAction(settingKey, newVal)}
              />
            );
          case "object":
            return (
              <context.UI.Inputs.FindObject
                context={context}
                modelId={setting.model}
                label={setting.label}
                value={setting.setting_value}
                primary={find(models, (m) => m.key === setting.model)?.primary}
                onChange={(newVal) => updateAction(settingKey, newVal)}
              />
            );
          default:
            return <div>Unknown setting type {setting.type}</div>;
        }
      })}
      <Divider />
      <Typography variant="h6">Delete</Typography>
      <Button
        fullWidth
        variant="contained"
        style={{ backgroundColor: "red", color: "white" }}
        onClick={() => {
          context.setDialog({
            display: true,
            title: "Are you sure?",
            content: "This cannot be undone.",
            buttons: [
              {
                label: (
                  <Typography style={{ color: "red" }}>Yes, delete</Typography>
                ),
                onClick: () => {
                  context
                    .deleteObjects("actions", { _id: action._id })
                    .then(() => {
                      history.replace("/settings/actions");
                    });
                },
              },
            ],
          });
        }}
      >
        Delete
      </Button>
    </>
  );
};

export default SettingsActionsSettings;

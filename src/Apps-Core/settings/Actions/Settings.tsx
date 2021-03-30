import { Typography } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { AppContextType, ModelType } from "../../../Utils/Types";
import { ActionType, ActionVarType } from "../Types";
import { map, find } from "lodash";

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
    map(action.data.data.vars, (v, k) => {
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
      <Typography variant="body1">
        Settings are easy to tweak options that influence how this action runs.
      </Typography>
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
    </>
  );
};

export default SettingsActionsSettings;

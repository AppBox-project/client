import React from "react";
import { AppContextType } from "../../../Utils/Types";
import { ActionType } from "../Types";

const SettingsActionsAbout: React.FC<{
  context: AppContextType;
  action: ActionType;
  setAction;
}> = ({ context, action, setAction }) => (
  <>
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
    <context.UI.Inputs.CheckmarkInput
      label="Active"
      value={action.data.active}
      onChange={(active) =>
        setAction({
          ...action,
          data: { ...action.data, active },
        })
      }
    />
  </>
);

export default SettingsActionsAbout;

import React from "react";
import { AppContextType } from "../../../Utils/Types";

const AppSettingsProcessCreate: React.FC<{ context: AppContextType }> = ({
  context,
}) => {
  return (
    <context.UI.Layouts.Object.ObjectLayout
      modelId="system-processes"
      layoutId="default"
      appId={context.appId}
      popup
    />
  );
};

export default AppSettingsProcessCreate;

import React from "react";
import { AppContextType, AppType } from "../../../Utils/Types";

const AppsDetailGeneral: React.FC<{
  app: AppType;
  context: AppContextType;
}> = ({ app, context }) => {
  // Vars
  // Lifecycle
  // UI
  return (
    <context.UI.Object.Detail
      context={context}
      layoutId="settings-basic"
      modelId="apps"
      object={app}
      objectId={app._id}
      mode="edit"
    />
  );
};

export default AppsDetailGeneral;

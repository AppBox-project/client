import React from "react";
import { AppContextType, ModelType } from "../../../Utils/Types";
import AppSettingsProcessCreate from "./CreateProcess";
import AppSettingsProcessEdit from "./EditProcess";

const AppSettingsProcessDetail: React.FC<{
  match: { params: { detailId } };
  context: AppContextType;
  model: ModelType;
}> = ({
  match: {
    params: { detailId },
  },
  context,
  model,
}) => {
  return (
    <context.UI.Design.Card withMargin>
      {detailId === "create" ? (
        <AppSettingsProcessCreate context={context} />
      ) : (
        <AppSettingsProcessEdit context={context} processId={detailId} />
      )}
    </context.UI.Design.Card>
  );
};

export default AppSettingsProcessDetail;

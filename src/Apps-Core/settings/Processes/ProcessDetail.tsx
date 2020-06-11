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
    <>
      {detailId === "create" ? (
        <AppSettingsProcessCreate context={context} />
      ) : (
        <AppSettingsProcessEdit context={context} processId={detailId} />
      )}
    </>
  );
};

export default AppSettingsProcessDetail;

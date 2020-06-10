import React from "react";
import { AppContextType, ModelType } from "../../../Utils/Types";
import AppSettingsProcessCreate from "./CreateProcess";

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
        "Edit a process"
      )}
    </>
  );
};

export default AppSettingsProcessDetail;

import React from "react";
import { AppContextType } from "../../../Utils/Types";
import AppSettingsProject from "./Projects";

const AppSettingsDetail: React.FC<{
  setSelectedMemo;
  context: AppContextType;
  match: { params: { detailId } };
}> = ({
  setSelectedMemo,
  context,
  match: {
    params: { detailId },
  },
}) => {
  switch (detailId) {
    case "projects":
      return <AppSettingsProject context={context} />;
    default:
      return <>Unknown settings page</>;
  }
};

export default AppSettingsDetail;

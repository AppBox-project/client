import React from "react";
import { AppContextType } from "../../../Utils/Types";
import AppSettingsProject from "./Projects";
import AppSettingsTag from "./Tags";

const AppSettingsDetail: React.FC<{
  setSelectedMemo;
  context: AppContextType;
  match: { params: { detailId } };
}> = ({
  context,
  match: {
    params: { detailId },
  },
}) => {
  switch (detailId) {
    case "projects":
      return <AppSettingsProject context={context} />;
    case "tags":
      return <AppSettingsTag context={context} />;
    default:
      return <>Unknown settings page</>;
  }
};

export default AppSettingsDetail;

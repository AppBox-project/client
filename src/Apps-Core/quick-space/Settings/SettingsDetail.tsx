import React, { useGlobal } from "reactn";
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
  // Vars
  const [isMobile] = useGlobal<any>("isMobile");

  // UI
  switch (detailId) {
    case "projects":
      return <AppSettingsProject context={context} isMobile={isMobile} />;
    case "tags":
      return <AppSettingsTag context={context} isMobile={isMobile} />;
    default:
      return <>Unknown settings page</>;
  }
};

export default AppSettingsDetail;

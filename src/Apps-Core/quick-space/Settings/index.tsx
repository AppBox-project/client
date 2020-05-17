import React from "react";
import { AppContextType } from "../../../Utils/Types";
import AppSettingsDetail from "./SettingsDetail";

const AppSettings: React.FC<{
  context: AppContextType;
  match: { params: {} };
}> = ({ context }) => {
  // Vars
  return (
    <context.UI.Layouts.ListDetailLayout
      list={[
        { label: "Projects", id: "projects" },
        { label: "Tags", id: "tags" },
        { label: "Preferences", id: "preferences" },
      ]}
      baseUrl={`/${context.appId}/settings`}
      context={context}
      DetailComponent={AppSettingsDetail}
      navWidth={2}
    />
  );
};

export default AppSettings;

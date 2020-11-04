import React from "react";
import { useEffect, useState } from "reactn";
import { AppContextType } from "../../Utils/Types";
import { StoreAppType } from "./Types";
import AppHubApp from "./View";

const AppHub: React.FC<{
  match: { isExact: boolean };
  context: AppContextType;
  action: string;
}> = (props) =>
  props.match.isExact ? <AppHubBrowse {...props} /> : <AppHubApp {...props} />;

export default AppHub;

const AppHubBrowse: React.FC<{
  match: { isExact: boolean };
  context: AppContextType;
  action: string;
}> = ({ context, action, match: { isExact } }) => {
  // Vars
  const [apps, setApps] = useState<StoreAppType[]>();

  // Lifecycle
  useEffect(() => {
    context
      .getDataFromExternalApi(
        "https://appbox.vicvancooten.nl/api/appbox-app/read?baseUrl=base"
      )
      .then((data: StoreAppType[]) => setApps(data))
      .catch((err) => console.log(err));
  }, []);

  // UI
  if (!apps) return <context.UI.Loading />;
  return (
    <context.UI.Layouts.GridItemLayout
      data={apps}
      title="data.name"
      text="data.summary"
      link="data.key"
      image="data.banner.url"
      baseUrl="/app-hub/browse/"
    />
  );
};

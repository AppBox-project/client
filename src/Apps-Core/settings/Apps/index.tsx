import React, { useState, useEffect } from "reactn";
import {
  AppContextType,
  AppType,
  ListDetailItemType,
} from "../../../Utils/Types";
import AppsDetail from "./Detail";

const AppSettingsApps: React.FC<{
  match: { isExact: boolean };
  context: AppContextType;
  action: string;
}> = ({ context, action, match: { isExact } }) => {
  // Vars
  const [appList, setAppList] = useState<ListDetailItemType[]>();
  const [apps, setApps] = useState<AppType[]>();

  // Lifecycle
  useEffect(() => {
    context.getObjects("apps", { "data.type": "collection" }, (response) => {
      if (response.success) {
        setApps(response.data);
        const newList: ListDetailItemType[] = [];
        response.data.map((app: AppType) =>
          newList.push({
            label: app.data.name,
            id: app.data.id,
            icon: app.data.icon,
          })
        );
        setAppList(newList);
      } else {
        console.log(response);
      }
    });
  }, []);

  // UI
  return (
    <context.UI.Layouts.ListDetailLayout
      context={context}
      baseUrl="/settings/apps"
      DetailComponent={AppsDetail}
      detailComponentProps={{ apps }}
      list={appList}
      title="Apps"
      addTitle="Add new collection"
      navWidth={3}
      addFunction={() => {}}
      description="Create and manage collections; the purely UI controlled version of apps."
    />
  );
};

export default AppSettingsApps;

import { Typography } from "@material-ui/core";
import React, { useState, useEffect } from "reactn";
import {
  AppContextType,
  AppType,
  ListDetailItemType,
} from "../../../Utils/Types";
import AppsDetail from "./Detail";
import { useHistory } from "react-router-dom";

const AppSettingsApps: React.FC<{
  match: { isExact: boolean };
  context: AppContextType;
  action: string;
}> = ({ context, action, match: { isExact } }) => {
  // Vars
  const [appList, setAppList] = useState<ListDetailItemType[]>();
  const [apps, setApps] = useState<AppType[]>();
  const history = useHistory();

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
      deleteFunction={(id) =>
        context.setDialog({
          display: true,
          title: "Are you sure?",
          content: `Deleting this app can't be undone.`,
          buttons: [
            {
              label: (
                <Typography variant="button" style={{ color: "red" }}>
                  Continue, delete
                </Typography>
              ),
              onClick: () => {
                context.deleteObjects("apps", { "data.id": id });
                history.replace(`/settings/apps`);
              },
            },
            {
              label: "Keep",
              onClick: () => {},
            },
          ],
        })
      }
      title="Apps"
      addTitle="Add new collection"
      navWidth={3}
      addFunction={() => {
        context.setDialog({
          display: true,
          title: "Create new app",
          content: (
            <context.UI.Object.Detail
              context={context}
              modelId="apps"
              layoutId="settings-create-collection"
              popup
              defaults={{
                type: "collection",
                collection_data: {
                  installScript: {
                    script: [],
                    data: { models: {}, objects: [] },
                  },
                  actions: [],
                },
              }}
              onSuccess={() => {
                context.setDialog({ display: false });
              }}
            />
          ),
        });
      }}
      description="Create and manage collections; the purely UI controlled version of apps."
    />
  );
};

export default AppSettingsApps;

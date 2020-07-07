import React from "react";
import { AppContextType } from "../../../Utils/Types";
import { useHistory, Route, Switch } from "react-router-dom";
import AppAHViewApp from "../ViewApp";

const AppAHBrowse: React.FC<{
  match: { isExact: boolean };
  context: AppContextType;
  action: string;
}> = ({ context, action, match: { isExact } }) => {
  return (
    <Switch>
      <Route
        path="/app-hub/browse/:appId"
        render={(props) => {
          return <AppAHViewApp context={context} {...props} />;
        }}
      />
      <Route
        render={() => {
          return <BrowseComponent context={context} />;
        }}
      />
    </Switch>
  );
};

export default AppAHBrowse;

const BrowseComponent: React.FC<{ context: AppContextType }> = ({
  context,
}) => {
  // Vars
  const history = useHistory();

  // Lifecycle

  // UI
  return (
    <context.UI.Layouts.GridItemLayout
      remoteList="https://appbox.vicvancooten.nl/api/appbox-app/read"
      title="Browse apps"
      dataMap={{
        title: "data.name",
        image: "data.banner.url",
        description: "data.description",
        id: "data.key",
        url: "data.key",
      }}
      baseUrl="/app-hub/browse"
      descriptionIsHtml
    />
  );
};

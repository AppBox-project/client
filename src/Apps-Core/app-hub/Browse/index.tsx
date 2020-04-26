import React, { useState, useEffect } from "react";
import { AppContextType } from "../../../Utils/Types";
import axios from "axios";
import { GridList, GridListTile, GridListTileBar } from "@material-ui/core";
import styles from "./styles.module.scss";
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
  const [apps, setApps] = useState([]);
  const history = useHistory();

  // Lifecycle
  useEffect(() => {
    axios
      .get("https://appbox.vicvan.co/api/appbox-app/read")
      .then((response) => {
        setApps(response.data);
      });
  }, []);

  // UI
  if (apps === []) return <context.UI.Loading />;
  return (
    <GridList cellHeight={300} cols={3}>
      {apps.map((app) => {
        return (
          <GridListTile
            key={app.data.key}
            cols={2}
            className={styles.appLink}
            onClick={() => {
              history.push(`/app-hub/browse/${app.data.key}`);
            }}
          >
            <img src={app.data.banner} alt={app.data.name} />
            <GridListTileBar
              title={app.data.name}
              subtitle={<span>by: {app.data.author}</span>}
            />
          </GridListTile>
        );
      })}
    </GridList>
  );
};

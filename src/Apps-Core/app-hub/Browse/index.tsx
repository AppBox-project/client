import React, { useState, useEffect } from "react";
import { AppContextType } from "../../../Utils/Types";
import axios from "axios";
import {
  GridList,
  GridListTile,
  GridListTileBar,
  Grid,
  Paper,
  Typography,
} from "@material-ui/core";
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
    <context.UI.Animations.AnimationContainer>
      <Grid container>
        {apps.map((app) => {
          return (
            <Grid
              item
              xs={12}
              md={3}
              key={app.data.key}
              onClick={() => {
                history.push(`/app-hub/browse/${app.data.key}`);
              }}
              className={styles.appLink}
              style={{ backgroundImage: `url(${app.data.banner.url})` }}
            >
              <context.UI.Animations.AnimationItem>
                <Typography variant="body1" style={{ paddingTop: 15 }}>
                  {app.data.name}
                </Typography>
              </context.UI.Animations.AnimationItem>
            </Grid>
          );
        })}
      </Grid>
    </context.UI.Animations.AnimationContainer>
  );
};

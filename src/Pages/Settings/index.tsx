import React from "react";
import {
  Hidden,
  Grid,
  List,
  ListSubheader,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { Link, Switch, Route } from "react-router-dom";
import FourOhFour from "../../Components/FourOhFour";
import SettingUpdate from "./Settings/Updates";

const SettingsPage: React.FC = () => {
  return (
    <>
      <Hidden xsDown>
        <div style={{ marginTop: 64 }} />
      </Hidden>
      <Grid container>
        <Grid item xs={2}>
          <List>
            <ListSubheader>Settings</ListSubheader>
            <Link to="/settings/update">
              <ListItem button>
                <ListItemIcon>
                  <FaCloudDownloadAlt />
                </ListItemIcon>
                <ListItemText>Updates</ListItemText>
              </ListItem>
            </Link>
          </List>
        </Grid>
        <Grid item xs={10}>
          <Switch>
            <Route path="/settings/update" component={SettingUpdate} />
            <Route component={FourOhFour} />
          </Switch>
        </Grid>
      </Grid>
    </>
  );
};

export default SettingsPage;

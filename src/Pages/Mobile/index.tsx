import React, { useState, useEffect, useGlobal } from "reactn";
import { FaGripHorizontal, FaTimes, FaHome } from "react-icons/fa";
import uniqid from "uniqid";
import Server from "../../Utils/Server";
import Loading from "../../Components/Loading";
import * as icons from "react-icons/fa";
import { useHistory } from "react-router-dom";
import { Switch, Route, Link } from "react-router-dom";
import StartPage from "../../Components/Apps/StartPage";
import AppRenderer from "../../Components/Apps/Apps/AppRenderer";
import FourOhFour from "../../Components/FourOhFour";
import { SpeedDial, SpeedDialAction } from "@material-ui/lab";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import SettingsPage from "../Settings";

const MobileLayout: React.FC = () => {
  const [apps, setApps] = useState();
  const history = useHistory();
  const currentTab = window.location.href.split("/")[3]
    ? window.location.href.split("/")[3]
    : "home";
  const [fabOpen, setFabOpen] = useState(false);
  const [isMobile, setIsMobile] = useGlobal<any>("isMobile");
  const [gApp] = useGlobal<any>("app");
  const [gUser] = useGlobal<any>("user");
  const [drawerOpen, setDrawerOpen] = useState(false);

  // UI
  // Lifecycle
  useEffect(() => {
    const requestId = uniqid();
    Server.emit("listenForObjects", { requestId, type: "app", filter: {} });
    Server.on(`receive-${requestId}`, (response) => {
      if (response.success) {
        setApps(response.data);
      } else {
        console.log(response);
      }
    });
    setIsMobile(true);

    return () => {
      Server.emit("unlistenForObjects", { requestId });
      setIsMobile(undefined);
    };
  }, []);
  console.log(gApp);

  if (!apps) return <Loading />;
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => {
              setDrawerOpen(!drawerOpen);
            }}
          >
            <MenuIcon />
          </IconButton>
          <Link to="/" style={{ color: "white", flexGrow: 1 }}>
            <Typography variant="h6">
              {gApp ? gApp.data.name : "AppBox"}
            </Typography>
          </Link>
          <Link to="/settings/update">
            <IconButton style={{ width: 64 }}>
              <Avatar>{gUser.data.first_name}</Avatar>
            </IconButton>
          </Link>
        </Toolbar>
      </AppBar>
      <SwipeableDrawer
        anchor="left"
        open={drawerOpen}
        onOpen={(event) => {
          setDrawerOpen(true);
        }}
        onClose={(event) => {
          setDrawerOpen(false);
        }}
      >
        <List>
          {
            //@ts-ignore
            apps.map((app) => {
              const Icon = icons[app.data.icon];
              return (
                <ListItem
                  key={app.data.key}
                  button
                  onClick={() => {
                    history.push(`/${app.data.id}`);
                    setDrawerOpen(false);
                  }}
                >
                  <ListItemIcon>
                    <Icon style={{ height: 25, width: 25 }} />
                  </ListItemIcon>
                  <ListItemText>{app.data.name}</ListItemText>
                </ListItem>
              );
            })
          }
        </List>
        <Divider />
        <List>
          {["All mail", "Trash", "Spam"].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>
                {index % 2 === 0 ? <icons.FaMailBulk /> : <icons.FaMailchimp />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </SwipeableDrawer>
      <Switch>
        <Route path="/" exact component={StartPage} />
        <Route path="/apps" exact component={StartPage} />
        <Route path="/settings" component={SettingsPage} />
        <Route path="/home" exact component={StartPage} />
        <Route
          path="/:appId"
          render={(params) => {
            return <AppRenderer {...params} setCurrentApp={() => {}} />;
          }}
        />
        <Route component={FourOhFour} />
      </Switch>
    </>
  );
};

export default MobileLayout;

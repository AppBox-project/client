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
  Icon,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import SettingsPage from "../Settings";
import { map } from "lodash";

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
  const [gButtons] = useGlobal<any>("buttons");
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
          {map(gButtons, (button, id) => {
            const Icon = button.icon;
            return (
              <IconButton
                onClick={button.action}
                style={{ color: "white" }}
                key={id}
              >
                <Icon />
              </IconButton>
            );
          })}
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
          <ListItem
            button
            onClick={() => {
              history.push(`/`);
              setDrawerOpen(false);
            }}
          >
            <ListItemIcon>
              <Icon color="primary">
                <icons.FaBoxOpen style={{ width: 24, height: 24 }} />
              </Icon>
            </ListItemIcon>
            <ListItemText>
              <Typography color="primary" variant="h6">
                AppBox
              </Typography>
            </ListItemText>
          </ListItem>
          <Divider />

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
                    <Icon
                      style={{
                        height: 25,
                        width: 25,
                        color: `rgba(${app.data.color.r},${app.data.color.g},${app.data.color.b})`,
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText>{app.data.name}</ListItemText>
                </ListItem>
              );
            })
          }
        </List>
        <div style={{ position: "absolute", bottom: 0, width: "100%" }}>
          <Divider />
          <List>
            <ListItem
              button
              onClick={() => {
                setDrawerOpen(false);
                history.push("/settings");
              }}
            >
              <ListItemIcon>
                <icons.FaCogs style={{ width: 24, height: 24 }} />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                {user.data.picture ? (
                    <Avatar src={baseUrl + user.data.picture} />
                  ) : (
                    <Avatar>{user.data.first_name}</Avatar>
                  )}
              </ListItemIcon>
              <ListItemText primary={gUser.data.full_name} />
            </ListItem>
          </List>
        </div>
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

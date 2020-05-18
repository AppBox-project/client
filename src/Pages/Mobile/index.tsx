import React, { useState, useEffect, useGlobal } from "reactn";
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
import NavBar from "../../Components/NavBar";
import styles from "./styles.module.scss";
import { baseUrl } from "../../Utils/Utils";

const MobileLayout: React.FC = () => {
  const [apps, setApps] = useState();
  const history = useHistory();
  const currentTab = window.location.href.split("/")[3]
    ? window.location.href.split("/")[3]
    : "home";
  const [isMobile, setIsMobile] = useGlobal<any>("isMobile");
  const [gUser] = useGlobal<any>("user");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navBar, setNavBar] = useGlobal<any>("navBar");
  const [defaultButton, setDefaultButton] = useGlobal<any>("defaultButton");

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

    setDefaultButton({
      icon: <MenuIcon />,
      function: () => {
        setDrawerOpen(true);
      },
    });
    setNavBar({
      ...navBar,
      backButton: {
        icon: <MenuIcon />,
        function: () => {
          setDrawerOpen(true);
        },
      },
    });

    return () => {
      Server.emit("unlistenForObjects", { requestId });
      setIsMobile(undefined);
      setNavBar({
        ...navBar,
        backButton: {
          icon: undefined,
          function: undefined,
        },
      });
    };
  }, []);

  if (!apps) return <Loading />;

  return (
    <>
      <NavBar />
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
                {gUser.data.picture ? (
                  <Avatar src={baseUrl + gUser.data.picture} />
                ) : (
                  <Avatar>{gUser.data.first_name}</Avatar>
                )}
              </ListItemIcon>
              <ListItemText primary={gUser.data.full_name} />
            </ListItem>
          </List>
        </div>
      </SwipeableDrawer>
      <div className={styles.app}>
        <Switch>
          <Route path="/" exact component={StartPage} />
          <Route path="/apps" exact component={StartPage} />
          <Route path="/home" exact component={StartPage} />
          <Route
            path="/:appId"
            render={(params) => {
              return <AppRenderer {...params} setCurrentApp={() => {}} />;
            }}
          />
          <Route component={FourOhFour} />
        </Switch>
      </div>
    </>
  );
};

export default MobileLayout;

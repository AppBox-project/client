import React, { useState, useEffect, useGlobal } from "reactn";
import uniqid from "uniqid";
import Server from "../../Utils/Server";
import Loading from "../../Components/Loading";
import { useHistory } from "react-router-dom";
import { Switch, Route } from "react-router-dom";
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
  Badge,
  IconButton,
  Collapse,
  ListSubheader,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import NavBar from "../../Components/NavBar";
import styles from "./styles.module.scss";
import { baseUrl } from "../../Utils/Utils";
import LinkHandler from "../LinkHandler";
import { NotificationType } from "../../Utils/Types";
import RecentNotifications from "../../Components/Notifications";
import { FaBell, FaBoxOpen, FaCogs, FaDoorOpen } from "react-icons/fa";
import FaIcon from "../../Components/Icons";

const MobileLayout: React.FC = () => {
  const [apps, setApps] = useState<any>();
  const history = useHistory();
  const [isMobile, setIsMobile] = useGlobal<any>("isMobile");
  const [gUser] = useGlobal<any>("user");
  const [drawerOpen, setDrawerOpen] = useState<any>(false);
  const [navBar, setNavBar] = useGlobal<any>("navBar");
  const [defaultButton, setDefaultButton] = useGlobal<any>("defaultButton");
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [
    unreadNotificationCount,
    setUnreadNotificationCount,
  ] = useState<number>(0);
  const [notificationsVisible, setNotificationsVisible] = useState<boolean>(
    false
  );

  // UI
  // Lifecycle
  useEffect(() => {
    const requestId = uniqid();
    Server.emit("listenForObjects", {
      requestId,
      type: "apps",
      filter: {},
    });
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

    // Notifications
    const notificationRequestId = uniqid();
    Server.emit("listenForObjects", {
      requestId: notificationRequestId,
      type: "notifications",
      filter: {},
    });
    Server.on(`receive-${notificationRequestId}`, (response) => {
      let unreadCount = 0;
      if (response.success) {
        setNotifications(response.data);
        response.data.map((not) => {
          if (!not?.data?.read) {
            unreadCount++;
          }
        });

        setUnreadNotificationCount(unreadCount);
      } else {
        console.log(response);
      }
    });

    return () => {
      setDefaultButton({
        icon: undefined,
        url: undefined,
        function: undefined,
      });
      Server.emit("unlistenForObjects", { requestId });
      Server.emit("unlistenForObjects", {
        requestId: notificationRequestId,
      });
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
                <FaBoxOpen style={{ width: 24, height: 24 }} />
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
            apps.map((app) => (
              <ListItem
                key={app._id}
                button
                onClick={() => {
                  history.push(`/${app.data.id}`);
                  setDrawerOpen(false);
                }}
              >
                <ListItemIcon>
                  <FaIcon
                    icon={app.data.icon}
                    style={{
                      height: 25,
                      width: 25,
                      color: `rgba(${app.data.color.r},${app.data.color.g},${app.data.color.b})`,
                    }}
                  />
                </ListItemIcon>
                <ListItemText>{app.data.name}</ListItemText>
              </ListItem>
            ))
          }
        </List>
        <div style={{ position: "absolute", bottom: 0, width: "100%" }}>
          <Divider />
          <List>
            <ListItem
              button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("username");
                window.location.reload();
              }}
            >
              <ListItemIcon>
                <FaDoorOpen style={{ width: 24, height: 24 }} />
              </ListItemIcon>
              <ListItemText primary="Sign out" />
            </ListItem>
            <ListItem
              button
              onClick={() => {
                setDrawerOpen(false);
                history.push("/settings");
              }}
            >
              <ListItemIcon>
                <FaCogs style={{ width: 24, height: 24 }} />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
            <Collapse in={notificationsVisible} timeout="auto" unmountOnExit>
              <Divider style={{ marginTop: 15 }} />
              <List component="div" disablePadding>
                <ListSubheader>Notifications</ListSubheader>
                <RecentNotifications
                  onClose={() => {
                    setDrawerOpen(false);
                    setNotificationsVisible(false);
                  }}
                  notifications={notifications}
                />
              </List>
            </Collapse>
            <ListItem
              button
              onClick={() => setNotificationsVisible(!notificationsVisible)}
            >
              <ListItemIcon>
                <Badge badgeContent={unreadNotificationCount} color="secondary">
                  <FaBell style={{ width: 24, height: 24 }} />
                </Badge>
              </ListItemIcon>
              <ListItemText
                primary="Notifications"
                secondary={
                  unreadNotificationCount !== 0 &&
                  `${
                    unreadNotificationCount === 1
                      ? `1 new notification`
                      : `${unreadNotificationCount} new notifications`
                  }`
                }
              />
            </ListItem>
            <Divider style={{ marginBottom: 15 }} />
            <ListItem
              button
              onClick={() => {
                setDrawerOpen(false);
                history.push("/system/user");
              }}
            >
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
          <Route path="/o/:objectId" component={LinkHandler} />
          <Route
            path="/:appId"
            render={(params) => {
              return <AppRenderer {...params} setCurrentApp={() => {}} />;
            }}
          />

          <Route path="/" exact component={StartPage} />
          <Route component={FourOhFour} />
        </Switch>
      </div>
    </>
  );
};

export default MobileLayout;

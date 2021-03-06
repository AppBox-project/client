import React, { useGlobal } from "reactn";
import styles from "./styles.module.scss";
import { motion } from "framer-motion";
import {
  IconButton,
  Avatar,
  Tooltip,
  Popover,
  ListItemIcon,
  ListItemText,
  List,
  ListItem,
  Badge,
} from "@material-ui/core";
import { useState, useEffect } from "react";
import Server from "../../Utils/Server";
import uniqid from "uniqid";
import { Link, useHistory, Switch, Route } from "react-router-dom";
import FourOhFour from "../../Components/FourOhFour";
import StartPage from "../../Components/Apps/StartPage";
import AppRenderer from "../../Components/Apps/Apps/AppRenderer";
import { baseUrl } from "../../Utils/Utils";
import NavBar from "../../Components/NavBar";
import LinkHandler from "../LinkHandler";
import NavBarSkeleton from "./NavBarSkeleton";
import AppBarAppList from "./AppList";
import { AppType, NotificationType } from "../../Utils/Types";
import Card from "../../Components/Design/Card";
import AppContextMenu from "./AppContextMenu";
import RecentNotifications from "../../Components/Notifications";
import { FaBoxOpen, FaDoorOpen } from "react-icons/fa";
import FaIcon from "../../Components/Icons";

const Desktop: React.FC = () => {
  const [currentApp, setCurrentApp] = useState<any>();
  const [isMobile, setIsMobile] = useGlobal<any>("isMobile");

  // Lifecycle
  useEffect(() => {
    setIsMobile(false);
    return () => {
      setIsMobile(undefined);
    };
  }, []);

  // UI
  return (
    <>
      <NavBar currentApp={currentApp} />
      <div className={styles.appRightWrapper}>
        <AppBar currentApp={currentApp} />
        <div className={styles.appSpace}>
          <Switch>
            <Route path="/o/:objectId" component={LinkHandler} />
            <Route
              path="/:appId"
              render={(params) => {
                return (
                  <AppRenderer {...params} setCurrentApp={setCurrentApp} />
                );
              }}
            />
            <Route path="/" exact component={StartPage} />
            <Route component={FourOhFour} />
          </Switch>
        </div>
      </div>
    </>
  );
};

const AppBar: React.FC<{ currentApp: string }> = ({ currentApp }) => {
  const list = {
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1,
        ease: "easeOut",
      },
    },
    hidden: {
      opacity: 0,
      x: -10,
      transition: {
        when: "afterChildren",
      },
    },
  };
  const item = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: 10 },
  };
  const [user] = useGlobal<any>("user");
  const [apps, setApps] = useState<{}>();
  const [userAppList, setUserAppList] = useState<string[]>();
  const [appList, setAppList] = useState<AppType[]>();
  const [theme] = useGlobal<any>("theme");
  const history = useHistory();
  const [appListAnchor, setAppListAnchor] = useState<any>();
  const [appContextMenuAnchor, setAppContextMenuAnchor] = useState<any>();
  const [appContextMenuApp, setAppContextMenuApp] = useState<AppType>();
  const [userMenuAnchor, setUserMenuAnchor] = useState<any>();
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [
    unreadNotificationCount,
    setUnreadNotificationCount,
  ] = useState<number>(0);

  // Lifecycle
  useEffect(() => {
    // Get all apps
    const requestId = uniqid();
    Server.emit("listenForObjects", { requestId, type: "apps", filter: {} });
    Server.on(`receive-${requestId}`, (response) => {
      if (response.success) {
        const al = {};
        response.data.map((a) => (al[a._id] = a));
        setApps(al);
        setAppList(response.data);
      } else {
        console.log(response);
      }
    });

    // Get user app list
    const userRequestId = uniqid();
    Server.emit("getUserSetting", { requestId: userRequestId, key: "applist" });
    Server.on(`receive-${userRequestId}`, (response) => {
      if (response.success) {
        setUserAppList(response.data.value);
      } else {
        console.log(response);
        setUserAppList([]);
      }
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
      Server.emit("unlistenForObjects", { requestId });
      Server.emit("stopGettingUserSetting", { requestId: userRequestId });
      Server.emit("unlistenForObjects", { requestId: notificationRequestId });
    };
  }, []);

  // UI
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={list}
      className={styles.appbar}
      style={{
        backgroundColor: theme.palette.primary.main,
        transition: "all 0.3s",
      }}
    >
      <div className={styles.shadow} />
      <motion.div variants={item} style={{ width: "100%", height: 64 }}>
        <Link to="/">
          <Tooltip
            title={
              window.location.pathname === "/"
                ? "Open all apps"
                : "Home / (right) All apps"
            }
            placement="right"
          >
            <IconButton
              style={{ color: "white" }}
              onClick={(event) => {
                if (window.location.pathname === "/") {
                  setAppListAnchor(event.currentTarget);
                  event.preventDefault();
                } else {
                  history.push("/");
                }
              }}
              onContextMenu={(event) => {
                setAppListAnchor(event.currentTarget);
                event.preventDefault();
              }}
              onDoubleClick={(event) => {
                setAppListAnchor(event.currentTarget);
                event.preventDefault();
              }}
            >
              <FaBoxOpen className={styles.headerIcon} />
            </IconButton>
          </Tooltip>
        </Link>
      </motion.div>
      <Popover
        id="applist"
        open={Boolean(appListAnchor)}
        anchorEl={appListAnchor}
        onClose={() => {
          setAppListAnchor(null);
        }}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        classes={{ paper: styles.appList }}
        PaperProps={{ elevation: 0, style: { backgroundColor: "transparent" } }}
      >
        <AppBarAppList
          appList={appList}
          closePopover={() => {
            setAppListAnchor(null);
          }}
          userAppList={userAppList}
        />
      </Popover>
      <Popover
        id="appContextMenu"
        open={Boolean(appContextMenuAnchor)}
        anchorEl={appContextMenuAnchor}
        onClose={() => {
          setAppContextMenuAnchor(null);
          setAppContextMenuApp(undefined);
        }}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
        PaperProps={{
          elevation: 0,
          style: { backgroundColor: "transparent", width: 300 },
        }}
      >
        {appContextMenuApp && (
          <AppContextMenu
            app={appContextMenuApp}
            onClose={() => {
              setAppContextMenuAnchor(null);
              setAppContextMenuApp(undefined);
            }}
          />
        )}
      </Popover>
      <Popover
        id="userMenu"
        open={Boolean(userMenuAnchor)}
        anchorEl={userMenuAnchor}
        onClose={() => {
          setUserMenuAnchor(null);
        }}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        style={{ position: "fixed", bottom: 15, left: 40 }}
        PaperProps={{ elevation: 0, style: { backgroundColor: "transparent" } }}
      >
        <Card
          withBigMargin
          title={`Hi, ${user.data.first_name}`}
          centerTitle
          titleInPrimaryColor
          style={{ width: 350, paddingTop: 15 }}
          withoutPadding
          hoverable
        >
          <RecentNotifications
            onClose={() => setUserMenuAnchor(undefined)}
            notifications={notifications}
          />
          <List disablePadding>
            <ListItem
              button
              onClick={() => {
                history.push("/system/user");
                setUserMenuAnchor(undefined);
              }}
            >
              <ListItemIcon style={{ minWidth: 0, paddingRight: 10 }}>
                {user.data.picture ? (
                  <Avatar
                    style={{ width: 32, height: 32 }}
                    src={baseUrl + user.data.picture}
                  />
                ) : (
                  <Avatar style={{ width: 20, height: 20 }}>
                    {user.data.first_name}
                  </Avatar>
                )}
              </ListItemIcon>
              <ListItemText>{user.data.full_name}</ListItemText>
            </ListItem>
            <ListItem
              button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("username");
                window.location.reload();
              }}
            >
              <ListItemIcon
                style={{ minWidth: 0, paddingRight: 10 }}
                color="primary"
              >
                <Avatar style={{ width: 32, height: 32 }}>
                  <FaDoorOpen style={{ width: 20, height: 20 }} />
                </Avatar>
              </ListItemIcon>
              <ListItemText>Sign Out</ListItemText>
            </ListItem>
          </List>
        </Card>
      </Popover>
      <div
        style={{
          flex: 1,
          position: "relative",
          zIndex: 501,
          overflow: "hidden",
        }}
      >
        {userAppList && apps ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={list}
            className={styles.appbar}
            style={{
              backgroundColor: theme.palette.primary.main,
              transition: "all 0.3s",
            }}
          >
            {userAppList.map((appId) => {
              const app: AppType = apps[appId];
              if (app) {
                return (
                  <div
                    className={`${styles.item} ${
                      currentApp === app.data.id && styles.active
                    }`}
                    onContextMenu={(event) => {
                      setAppContextMenuAnchor(event.currentTarget);
                      setAppContextMenuApp(app);
                      event.preventDefault();
                    }}
                    onDoubleClick={(event) => {
                      setAppContextMenuAnchor(event.currentTarget);
                      setAppContextMenuApp(app);
                      event.preventDefault();
                    }}
                    key={app._id}
                  >
                    <motion.div variants={item} style={{ width: 64 }}>
                      <Tooltip placement="right" title={app.data.name}>
                        <Link to={`/${app.data.id}`} className="no-link">
                          <IconButton>
                            <Avatar
                              variant="rounded"
                              style={{
                                transition: "all 1s",
                                backgroundColor: `rgb(${app.data.color.r},${app.data.color.g},${app.data.color.b})`,
                              }}
                            >
                              <FaIcon
                                icon={app.data.icon}
                                className={styles.icon}
                              />
                            </Avatar>
                          </IconButton>
                        </Link>
                      </Tooltip>
                    </motion.div>
                  </div>
                );
              }
            })}
          </motion.div>
        ) : (
          <NavBarSkeleton />
        )}
      </div>
      <motion.div variants={item} style={{ height: 64, zIndex: 502 }}>
        <Tooltip placement="right" title={`Hi ${user.data.first_name}`}>
          <IconButton
            style={{ width: 64 }}
            onClick={(event) => {
              setUserMenuAnchor(event.currentTarget);
            }}
            onContextMenu={(event) => {
              setUserMenuAnchor(event.currentTarget);
              event.preventDefault();
            }}
          >
            <Badge badgeContent={unreadNotificationCount} color="secondary">
              {user.data.picture ? (
                <Avatar src={baseUrl + user.data.picture} />
              ) : (
                <Avatar>{user.data.first_name}</Avatar>
              )}
            </Badge>
          </IconButton>
        </Tooltip>
      </motion.div>
    </motion.div>
  );
};

export default Desktop;

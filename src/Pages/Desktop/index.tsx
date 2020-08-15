import React, { useGlobal } from "reactn";
import styles from "./styles.module.scss";
import { motion } from "framer-motion";
import { IconButton, Avatar, Tooltip, Popover } from "@material-ui/core";
import { useState, useEffect } from "react";
import Server from "../../Utils/Server";
import uniqid from "uniqid";
import * as icons from "react-icons/fa";
import { Link, useHistory, Switch, Route } from "react-router-dom";
import FourOhFour from "../../Components/FourOhFour";
import StartPage from "../../Components/Apps/StartPage";
import AppRenderer from "../../Components/Apps/Apps/AppRenderer";
import { GiCardboardBox } from "react-icons/gi";
import { baseUrl } from "../../Utils/Utils";
import NavBar from "../../Components/NavBar";
import LinkHandler from "../LinkHandler";
import NavBarSkeleton from "./NavBarSkeleton";
import InputInput from "../../Components/Inputs/Input";
import AppBarAppList from "./AppList";
import { AppType } from "../../Utils/Types";

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

  // Lifecycle
  useEffect(() => {
    // Get all apps
    const requestId = uniqid();
    Server.emit("listenForObjects", { requestId, type: "app", filter: {} });
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

    return () => {
      Server.emit("unlistenForObjects", { requestId });
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
                : "Back (rightclick opens applist)"
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
              <icons.FaBoxOpen style={{ width: 40, height: 40 }} />
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
        PaperProps={{ elevation: 5 }}
      >
        <AppBarAppList
          appList={appList}
          closePopover={() => {
            setAppListAnchor(null);
          }}
          userAppList={userAppList}
        />
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
              const app = apps[appId];
              const Icon = icons[app.data.icon];
              return (
                <div
                  className={`${styles.item} ${
                    currentApp === app.data.id && styles.active
                  }`}
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
                            <Icon />
                          </Avatar>
                        </IconButton>
                      </Link>
                    </Tooltip>
                  </motion.div>
                </div>
              );
            })}
          </motion.div>
        ) : (
          <NavBarSkeleton />
        )}
      </div>
      <motion.div variants={item} style={{ height: 64, zIndex: 502 }}>
        <Link to={`/o/${user._id}`}>
          <Tooltip placement="right" title={`Hi ${user.data.first_name}`}>
            <IconButton style={{ width: 64 }}>
              {user.data.picture ? (
                <Avatar src={baseUrl + user.data.picture} />
              ) : (
                <Avatar>{user.data.first_name}</Avatar>
              )}
            </IconButton>
          </Tooltip>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default Desktop;

import React, { useGlobal } from "reactn";
import styles from "./styles.module.scss";
import { motion } from "framer-motion";
import {
  IconButton,
  Avatar,
  CircularProgress,
  Tooltip,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Server from "../../Utils/Server";
import uniqid from "uniqid";
import * as icons from "react-icons/fa";
import { Switch, Route } from "react-router-dom";
import FourOhFour from "../../Components/FourOhFour";
import StartPage from "../../Components/Apps/StartPage";
import AppRenderer from "../../Components/Apps/Apps/AppRenderer";
import { GiCardboardBox } from "react-icons/gi";
import { baseUrl } from "../../Utils/Utils";
import NavBar from "../../Components/NavBar";
import LinkHandler from "../LinkHandler";

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
  const [apps, setApps] = useState<any>();
  const [theme] = useGlobal<any>("theme");

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
    return () => {
      Server.emit("unlistenForObjects", { requestId });
    };
  }, []);

  // UI
  if (!apps) return <CircularProgress />;
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
          <Tooltip title="Home" placement="right">
            <IconButton style={{ color: "white" }}>
              <icons.FaBoxOpen style={{ width: 40, height: 40 }} />
            </IconButton>
          </Tooltip>
        </Link>
      </motion.div>
      <div
        style={{
          flex: 1,
          position: "relative",
          zIndex: 501,
          overflow: "hidden",
        }}
      >
        {apps.map((app) => {
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

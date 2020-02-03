import React, { useEffect, useState } from "react";
import uniqid from "uniqid";
import Server from "../../../Utils/Server";
import { Typography, List, ListItem } from "@material-ui/core";
import Loading from "../../Loading";
import styles from "./styles.module.scss";
import { motion } from "framer-motion";
import { AppType, TypeType } from "../../../Utils/Types";
import { Link } from "react-router-dom";
import Page from "./Components/Page";
import { Route } from "react-router-dom";

const App: React.FC<{
  match: { params: { appId } };
  setCurrentApp: (string) => void;
}> = ({
  match: {
    params: { appId }
  },
  setCurrentApp
}) => {
  const [app, setApp] = useState();
  const [currentPage, setCurrentPage] = useState();

  //Lifecycle
  useEffect(() => {
    setCurrentApp(appId);

    const requestId = uniqid();
    Server.emit("listenForObjects", {
      requestId,
      type: "app",
      filter: { "data.id": appId }
    });
    Server.on(`receive-${requestId}`, response => {
      if (response.success) {
        setApp(response.data[0]);
      } else {
        console.log(response);
      }
    });
    return () => {
      setCurrentApp(null);
      Server.emit("unlistenForObjects", { requestId });
    };
  }, []);

  //UI
  if (!app) return <Loading />;
  return (
    <>
      <SubMenu app={app} currentPage={currentPage} />
      <div className={styles.app}>
        <Route
          path="/:appId/:pageId"
          render={props => {
            return (
              <Page {...props} setCurrentPage={setCurrentPage} app={app} />
            );
          }}
        />
      </div>
    </>
  );
};

const SubMenu: React.FC<{ app: AppType; currentPage: string }> = ({
  app,
  currentPage
}) => {
  const list = {
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.2,
        when: "beforeChildren",
        staggerChildren: 0.1,
        ease: "easeOut"
      }
    },
    hidden: {
      opacity: 0,
      x: -25,
      transition: {
        when: "afterChildren"
      }
    }
  };
  const item = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: 10 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={list}
      className={styles.menu}
    >
      <motion.div variants={item}>
        <Typography
          variant="h6"
          style={{
            textAlign: "center",
            color: `rgb(${app.data.color.r},${app.data.color.g},${app.data.color.b})`
          }}
        >
          {app.data.name}
        </Typography>
      </motion.div>

      {app.data.menu_type === "ObjectTypes" && (
        <SubMenuObjectTypes app={app} currentPage={currentPage} />
      )}
    </motion.div>
  );
};

const SubMenuObjectTypes: React.FC<{ app: AppType; currentPage: string }> = ({
  app,
  currentPage
}) => {
  const [objectTypes, setObjectTypes] = useState();

  const list = {
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1,
        ease: "easeOut"
      }
    },
    hidden: {
      opacity: 0,
      x: -25,
      transition: {
        when: "afterChildren"
      }
    }
  };
  const item = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: 10 }
  };

  // Lifecycle
  useEffect(() => {
    const requestId = uniqid();
    Server.emit("listenForObjectTypes", { requestId, filter: {} });
    Server.on(`receive-${requestId}`, response => {
      setObjectTypes(response);
    });
    return () => {
      Server.emit("unlistenForObjectTypes", { requestId });
    };
  }, []);

  // UI
  if (!objectTypes) return <Loading />;
  return (
    <motion.div initial="hidden" animate="visible" variants={list}>
      <List>
        {objectTypes.map((type: TypeType) => {
          return (
            <motion.div variants={item} key={type.key}>
              <Link
                className="no-link"
                to={`/${app.data.id}/${type.key}`}
                style={{ color: "rgb(66, 82, 110)" }}
              >
                <ListItem button selected={currentPage === type.key}>
                  {type.name_plural}
                </ListItem>
              </Link>
            </motion.div>
          );
        })}
      </List>
    </motion.div>
  );
};

export default App;

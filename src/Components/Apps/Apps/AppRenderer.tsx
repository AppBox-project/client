import React, { useEffect, useState } from "react";
import uniqid from "uniqid";
import Server from "../../../Utils/Server";
import { Typography, List, ListItem, ListItemText } from "@material-ui/core";
import Loading from "../../Loading";
import styles from "./styles.module.scss";
import { motion } from "framer-motion";
import { AppType, TypeType, AppContextType } from "../../../Utils/Types";
import { Link, Route, Switch } from "react-router-dom";

import { AppContext } from "./AppContext";

const App: React.FC<{
  match: { params: { appId } };
  setCurrentApp: (string) => void;
}> = ({
  match: {
    params: { appId }
  },
  setCurrentApp
}) => {
  const [appContext, setAppcontext] = useState<AppContextType>();
  const [currentPage, setCurrentPage] = useState();

  //Lifecycle
  useEffect(() => {
    setCurrentApp(appId);
    const context = new AppContext(appId);
    context.isReady.then(() => {
      //@ts-ignore
      setAppcontext(context);
    });
    return () => {
      setCurrentApp(null);
      setAppcontext(null);
      context.unload();
    };
  }, [appId]);

  //UI
  if (!appContext) return <Loading />;
  return (
    <>
      <ActionMenu context={appContext} currentPage={currentPage} />
      <div className={styles.app}>
        <Switch>
          {appContext.actions.map(action => {
            return (
              <Route
                key={action.key}
                path={`/${appId}/${action.key}`}
                render={props => {
                  const Component = action.component;
                  return (
                    <Component
                      {...props}
                      context={appContext}
                      action={action.key}
                    />
                  );
                }}
              />
            );
          })}
        </Switch>
      </div>
    </>
  );
};

const ActionMenu: React.FC<{
  context: AppContextType;
  currentPage: string;
}> = ({ context, currentPage }) => {
  const list = {
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.2,
        when: "beforeChildren",
        staggerChildren: 0.08,
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
            color: `rgb(${context.app.data.color.r},${context.app.data.color.g},${context.app.data.color.b})`
          }}
          className="cursor"
        >
          {context.app.data.name}
        </Typography>
      </motion.div>
      <List>
        {context.actions.map(action => {
          return (
            <motion.div variants={item} key={action.key}>
              <Link
                className="no-link"
                to={`/${context.app.data.id}/${action.key}`}
                style={{ color: "rgb(66, 82, 110)" }}
              >
                <ListItem button selected={currentPage === action.key}>
                  <ListItemText>{action.label}</ListItemText>
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

import React from "react";
import { AppContextType } from "../../../../../Utils/Types";
import { motion } from "framer-motion";
import { Link, Switch, Route } from "react-router-dom";
import styles from "./styles.module.scss";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Icon,
  Divider,
} from "@material-ui/core";
import { FaWrench } from "react-icons/fa";

const AppUIDesktop: React.FC<{ appContext; currentPage; setCurrentPage }> = ({
  appContext,
  currentPage,
  setCurrentPage,
}) => {
  return (
    <>
      <ActionMenu context={appContext} currentPage={currentPage} />
      <div className={styles.app}>
        <Switch>
          {appContext.actions.map((action) => {
            return (
              <Route
                key={action.key}
                path={`/${appContext.appId}/${action.key}`}
                render={(props) => {
                  const Component = action.component;
                  setCurrentPage(action.key);
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
          {appContext.appConfig && appContext.appConfig.settings && (
            <Route
              path={`/${appContext.appId}/settings`}
              component={appContext.appConfig.settings}
            />
          )}
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
        ease: "easeOut",
      },
    },
    hidden: {
      opacity: 0,
      x: -25,
      transition: {
        when: "afterChildren",
      },
    },
  };

  const item = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: 10 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={list}
      className={styles.menu}
    >
      <motion.div variants={item}>
        <Link to={`/${context.app.data.id}`}>
          <Typography
            variant="h6"
            style={{
              textAlign: "center",
              color: `rgb(${context.app.data.color.r},${context.app.data.color.g},${context.app.data.color.b})`,
            }}
            className="cursor"
          >
            {context.app.data.name}
          </Typography>
        </Link>
      </motion.div>
      <List>
        {context.actions.map((action) => {
          const ActionIcon: React.FC<{ style }> = action.icon;
          return (
            <motion.div variants={item} key={action.key}>
              <Link
                className="no-link"
                to={`/${context.app.data.id}/${action.key}`}
                style={{ color: "rgb(66, 82, 110)" }}
              >
                <ListItem button selected={currentPage === action.key}>
                  {ActionIcon && (
                    <ListItemIcon>
                      <Icon
                        color={
                          currentPage === action.key ? "primary" : "inherit"
                        }
                      >
                        <ActionIcon style={{ width: 18, height: 18 }} />
                      </Icon>
                    </ListItemIcon>
                  )}
                  <ListItemText>
                    <Typography
                      color={currentPage === action.key ? "primary" : "inherit"}
                    >
                      {action.label}
                    </Typography>
                  </ListItemText>
                </ListItem>
              </Link>
            </motion.div>
          );
        })}
      </List>
      {context.appConfig && context.appConfig.settings && (
        <motion.div
          variants={item}
          style={{ position: "absolute", bottom: 0, width: "85%" }}
        >
          <Divider />
          <List>
            <Link className="no-link" to={`/${context.app.data.id}/settings`}>
              <ListItem button>
                <ListItemIcon>
                  <FaWrench />
                </ListItemIcon>
                <ListItemText>Settings</ListItemText>
              </ListItem>
            </Link>
          </List>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AppUIDesktop;

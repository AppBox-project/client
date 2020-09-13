import React, { useState, useGlobal } from "reactn";
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
  ListSubheader,
} from "@material-ui/core";
import { FaWrench } from "react-icons/fa";
import InputInput from "../../../../Inputs/Input";
import FuzzySearch from "fuzzy-search";
import { map } from "lodash";
import { useEffect } from "reactn";

const AppUIDesktop: React.FC<{
  appContext: AppContextType;
  currentPage;
  setCurrentPage;
}> = ({ appContext, currentPage, setCurrentPage }) => {
  const [noActions, setNoActions] = useGlobal<any>("noActions");

  // Effects
  useEffect(() => {
    if (
      typeof appContext.actions === "function" ||
      appContext.app.data.menu_type === "hidden"
    )
      setNoActions(true);
    return () => {
      setNoActions(false);
    };
  }, [appContext.app]);
  // UI
  return (
    <>
      {typeof appContext.actions === "object" &&
        appContext.app.data.menu_type !== "hidden" && (
          <ActionMenu context={appContext} currentPage={currentPage} />
        )}
      <div
        className={styles.app}
        style={
          typeof appContext.actions === "function" ||
          appContext.app.data.menu_type === "hidden"
            ? { left: 0, width: "100%" }
            : {}
        }
      >
        <Switch>
          {typeof appContext.actions === "function" ? (
            <appContext.actions context={appContext} />
          ) : (
            appContext.actions.map((action) => {
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
            })
          )}
          {appContext.appConfig && appContext.appConfig.settings && (
            <Route
              path={`/${appContext.appId}/settings`}
              render={(props) => {
                setCurrentPage("settings");

                return (
                  <appContext.appConfig.settings
                    context={appContext}
                    {...props}
                  />
                );
              }}
            />
          )}
          {appContext.onNoAction && (
            <Route
              render={(props) => (
                <appContext.onNoAction {...props} context={appContext} />
              )}
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
  const [filter, setFilter] = useState<any>();
  const list = {
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.05,
        when: "beforeChildren",
        staggerChildren: 0.03,
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

  let actions = context.actions;
  const groupedActions = {};
  if (filter) {
    const searcher = new FuzzySearch(actions, ["key", "label"], {});
    actions = searcher.search(filter);
  }
  if (context.appConfig?.actions?.group) {
    if (typeof actions === "object") {
      actions.map((action) => {
        if (!groupedActions[action.group]) {
          groupedActions[action.group] = [];
        }
        groupedActions[action.group].push(action);
      });
    }
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={list}
      className={styles.menu}
    >
      <div style={{ height: context.appConfig?.actions?.filter ? 100 : 30 }}>
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
        {context.appConfig?.actions?.filter && (
          <motion.div variants={item}>
            <InputInput
              style={{ width: "78%", margin: "15px 15px" }}
              placeholder="Filter actions"
              value={filter}
              onChange={(value) => {
                setFilter(value);
              }}
            />
          </motion.div>
        )}
      </div>
      <div className={styles.menuBottom}>
        <List style={{ margin: 10 }}>
          {context.appConfig?.actions?.group
            ? map(groupedActions, (actions, group) => {
                return (
                  <div key={group}>
                    <motion.div variants={item}>
                      {group !== "undefined" && (
                        <ListSubheader
                          color="primary"
                          style={{ cursor: "default" }}
                        >
                          {group ? group : "Other"}
                        </ListSubheader>
                      )}
                    </motion.div>
                    {actions.map((action) => {
                      const ActionIcon: React.FC<{ style }> = action.icon;

                      return (
                        <motion.div variants={item} key={action.key}>
                          <Link
                            className="no-link"
                            to={`/${context.app.data.id}/${action.key}`}
                            style={{ color: "rgb(66, 82, 110)" }}
                          >
                            <ListItem
                              button
                              selected={currentPage === action.key}
                            >
                              {ActionIcon && (
                                <ListItemIcon>
                                  <Icon
                                    color={
                                      currentPage === action.key
                                        ? "primary"
                                        : "inherit"
                                    }
                                  >
                                    <ActionIcon
                                      style={{ width: 18, height: 18 }}
                                    />
                                  </Icon>
                                </ListItemIcon>
                              )}
                              <ListItemText>
                                <Typography
                                  color={
                                    currentPage === action.key
                                      ? "primary"
                                      : "inherit"
                                  }
                                >
                                  {action.label}
                                </Typography>
                              </ListItemText>
                            </ListItem>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                );
              })
            : typeof actions === "object" &&
              actions.map((action) => {
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
                                currentPage === action.key
                                  ? "primary"
                                  : "inherit"
                              }
                            >
                              <ActionIcon style={{ width: 18, height: 18 }} />
                            </Icon>
                          </ListItemIcon>
                        )}
                        <ListItemText>
                          <Typography
                            color={
                              currentPage === action.key ? "primary" : "inherit"
                            }
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
      </div>
      {context.appConfig && context.appConfig.settings && (
        <motion.div
          variants={item}
          style={{ position: "absolute", bottom: 0, width: "100%" }}
        >
          <Divider />
          <List>
            <Link className="no-link" to={`/${context.app.data.id}/settings`}>
              <ListItem button selected={currentPage === "settings"}>
                <ListItemIcon>
                  <Icon
                    color={currentPage === "settings" ? "primary" : "default"}
                  >
                    <FaWrench style={{ width: 18, height: 18 }} />
                  </Icon>
                </ListItemIcon>
                <ListItemText
                  color={currentPage === "settings" ? "primary" : "default"}
                >
                  <Typography
                    color={currentPage === "settings" ? "primary" : "inherit"}
                  >
                    Settings
                  </Typography>
                </ListItemText>
              </ListItem>
            </Link>
          </List>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AppUIDesktop;

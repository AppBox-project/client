import React, { useState, useGlobal } from "reactn";
import { motion } from "framer-motion";
import { Link, Switch, Route } from "react-router-dom";
import styles from "./styles.module.scss";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  ListSubheader,
  ListItemSecondaryAction,
  Collapse,
  Icon,
  Popover,
  Tooltip,
  IconButton,
} from "@material-ui/core";
import {
  FaAngleRight,
  FaChevronDown,
  FaChevronUp,
  FaWrench,
} from "react-icons/fa";
import InputInput from "../../../../Inputs/Input";
import FuzzySearch from "fuzzy-search";
import map from "lodash/map";
import { useEffect } from "reactn";
import { AppContext } from "../../AppContext";
import FaIcon from "../../../../Icons";
import Card from "../../../../Design/Card";
import RecentList from "../../../../RecentList";

const AppUIDesktop: React.FC<{
  appContext: AppContext;
  currentPage;
  setCurrentPage;
}> = ({ appContext, currentPage, setCurrentPage }) => {
  const [noActions, setNoActions] = useGlobal<any>("noActions");
  const [historyMenuEl, setHistoryMenuEl] = React.useState(null);
  const [shortcuts, setShortcuts] = useState<{
    title: string;
    shortcuts: string | [];
    model?: string;
    url?: string;
  }>();

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
  const subItems = [];

  // UI
  let SingleAction: React.FC<{ context: AppContext }>;
  if (typeof appContext.actions === "function")
    SingleAction = appContext.actions;
  return (
    <>
      <Popover
        id="recents"
        open={Boolean(historyMenuEl)}
        anchorEl={historyMenuEl}
        onClose={(event) => {
          setHistoryMenuEl(null);
        }}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
        PaperProps={{ elevation: 0, style: { backgroundColor: "transparent" } }}
      >
        <Card
          title={shortcuts?.title}
          withBigMargin
          centerTitle
          titleDivider
          titleInPrimaryColor
        >
          {shortcuts?.model ? (
            <RecentList
              modelId={shortcuts?.model}
              url={shortcuts?.url}
              onClose={() => setHistoryMenuEl(null)}
            />
          ) : (
            "Todo: custom recents"
          )}
        </Card>
      </Popover>
      {typeof appContext.actions === "object" &&
        appContext.app.data.menu_type !== "hidden" && (
          <ActionMenu
            context={appContext}
            currentPage={currentPage}
            setHistoryMenuEl={setHistoryMenuEl}
            setShortcuts={setShortcuts}
          />
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
          {SingleAction ? (
            <SingleAction context={appContext} />
          ) : (
            appContext.actions.map((action) => {
              if (action.subItems) {
                action.subItems.map((subItem) => {
                  subItems.push(
                    <Route
                      key={subItem.key}
                      path={`/${appContext.appId}/${subItem.key}`}
                      render={(props) => {
                        const Component = subItem.component;
                        setCurrentPage(subItem.key);
                        return (
                          <Component
                            {...props}
                            context={appContext}
                            action={subItem.key}
                          />
                        );
                      }}
                    />
                  );
                });
              }
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
          {subItems.length > 0 && subItems.map((subItem) => subItem)}
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
  context: AppContext;
  currentPage: string;
  setHistoryMenuEl;
  setShortcuts;
}> = ({ context, currentPage, setHistoryMenuEl, setShortcuts }) => {
  const [filter, setFilter] = useState<any>();
  const [gTheme] = useGlobal<any>("theme");

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
                color:
                  gTheme.palette.type === "light" &&
                  `rgb(${context.app.data.color.r},${context.app.data.color.g},${context.app.data.color.b})`,
                marginBottom: 15,
              }}
              className={styles.title}
            >
              {context.app.data.name}
            </Typography>
          </Link>
        </motion.div>
        {context.appConfig?.actions?.filter && (
          <motion.div variants={item}>
            <InputInput
              style={{ margin: 15, width: "calc(100% - 30px)" }}
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
        <Divider style={{ margin: 15 }} />
        <List style={{ margin: 10 }}>
          {context.appConfig?.actions?.group
            ? map(groupedActions, (actions: { [k: string]: any }[], group) => {
                return (
                  <div key={group}>
                    <motion.div variants={item}>
                      {group !== "undefined" && (
                        <ListSubheader
                          color={
                            gTheme.palette.type === "light"
                              ? "primary"
                              : "default"
                          }
                          style={{ cursor: "default" }}
                        >
                          {group ? group : "Other"}
                        </ListSubheader>
                      )}
                    </motion.div>
                    {actions.map((action) => (
                      <Action
                        context={context}
                        item={item}
                        action={action}
                        currentPage={currentPage}
                        gTheme={gTheme}
                        key={action.key}
                        setHistoryMenuEl={setHistoryMenuEl}
                        setShortcuts={setShortcuts}
                      />
                    ))}
                  </div>
                );
              })
            : typeof actions === "object" &&
              actions.map((action) => (
                <Action
                  context={context}
                  item={item}
                  action={action}
                  currentPage={currentPage}
                  gTheme={gTheme}
                  key={action.key}
                  setHistoryMenuEl={setHistoryMenuEl}
                  setShortcuts={setShortcuts}
                />
              ))}
        </List>
      </div>
      {context.appConfig && context.appConfig.settings && (
        <motion.div
          variants={item}
          style={{ position: "absolute", bottom: 0, width: "100%" }}
        >
          <Divider />
          <List>
            <Link
              className={styles.actionLink}
              to={`/${context.app.data.id}/settings`}
            >
              <ListItem button selected={currentPage === "settings"}>
                <ListItemIcon>
                  <Icon
                    color={
                      gTheme.palette.type === "light" &&
                      currentPage === "settings"
                        ? "primary"
                        : "default"
                    }
                  >
                    <FaWrench style={{ width: 18, height: 18 }} />
                  </Icon>
                </ListItemIcon>
                <ListItemText
                  color={
                    gTheme.palette.type === "light" &&
                    currentPage === "settings"
                      ? "primary"
                      : "default"
                  }
                >
                  <Typography
                    color={
                      gTheme.palette.type === "light" &&
                      currentPage === "settings"
                        ? "primary"
                        : "inherit"
                    }
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

const Action: React.FC<{
  item;
  action;
  context;
  currentPage;
  gTheme;
  setHistoryMenuEl;
  setShortcuts;
}> = ({
  item,
  action,
  context,
  currentPage,
  gTheme,
  setHistoryMenuEl,
  setShortcuts,
}) => {
  // Vars
  const [subItemsVisible, setSubItemsVisible] = useState<boolean>(false);

  // UI

  return (
    <motion.div variants={item} key={action.key}>
      <Link
        className={styles.actionLink}
        to={`/${context.app.data.id}/${action.key}`}
      >
        <ListItem button selected={currentPage === action.key}>
          <ListItemIcon style={{ minWidth: 16 }}>
            <Icon
              style={{
                color: gTheme.palette.type === "dark" && "white",
                width: 32,
              }}
              color={
                gTheme.palette.type === "light" && currentPage === action.key
                  ? "primary"
                  : "inherit"
              }
            >
              {typeof action?.icon === "string" ? (
                <FaIcon
                  icon={action.icon || "exclamation"}
                  style={{ width: 12 }}
                  size="xs"
                />
              ) : (
                action.icon &&
                (<action.icon /> ? <action.icon /> : "Unknown icon case?")
              )}
            </Icon>
          </ListItemIcon>

          <ListItemText>
            <Typography
              color={
                gTheme.palette.type === "light" && currentPage === action.key
                  ? "primary"
                  : "inherit"
              }
            >
              {action.label}
            </Typography>
          </ListItemText>
          {action.shortcuts && (
            <Tooltip
              title={action.shortcuts.title || "View shortcuts"}
              placement="right"
            >
              <ListItemSecondaryAction style={{ cursor: "pointer" }}>
                <IconButton
                  size="small"
                  color={currentPage === action.key ? "primary" : "inherit"}
                  onClick={(event) => {
                    event.stopPropagation();
                    event.preventDefault();
                    setHistoryMenuEl(event.currentTarget);
                    setShortcuts({
                      title: action.shortcuts.title || "View shortcuts",
                      shortcuts:
                        action.shortcuts.type === "recents" ? "recents" : [],
                      ...(action.shortcuts.type === "recents"
                        ? { model: action.shortcuts.model }
                        : {}),
                      url: action.shortcuts.url,
                    });
                  }}
                >
                  <FaAngleRight />
                </IconButton>
              </ListItemSecondaryAction>
            </Tooltip>
          )}
          {action.subItems && (
            <ListItemSecondaryAction
              onClick={(event) => {
                setSubItemsVisible(!subItemsVisible);
                event.stopPropagation();
                event.preventDefault();
              }}
            >
              {subItemsVisible ? <FaChevronUp /> : <FaChevronDown />}
            </ListItemSecondaryAction>
          )}
        </ListItem>
      </Link>
      {action.subItems && (
        <Collapse
          in={subItemsVisible}
          timeout="auto"
          unmountOnExit
          style={{ marginLeft: 30 }}
        >
          <List component="div" disablePadding>
            {action.subItems.map((subAction) => (
              <Action
                context={context}
                action={subAction}
                key={subAction.key}
                currentPage={currentPage}
                gTheme={gTheme}
                item={item}
                setHistoryMenuEl={setHistoryMenuEl}
                setShortcuts={setShortcuts}
              />
            ))}
          </List>
        </Collapse>
      )}
    </motion.div>
  );
};

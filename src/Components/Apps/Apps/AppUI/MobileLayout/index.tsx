import React, { useGlobal, useState, useEffect } from "reactn";
import {
  Tabs,
  Tab,
  BottomNavigation,
  BottomNavigationAction,
  SwipeableDrawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListSubheader,
  Icon,
  Typography,
} from "@material-ui/core";
import { AppContextType } from "../../../../../Utils/Types";
import { useHistory, Switch, Route } from "react-router-dom";
import { FaLemon, FaDropbox, FaCogs } from "react-icons/fa";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import FuzzySearch from "fuzzy-search";
import InputInput from "../../../../Inputs/Input";
import { map } from "lodash";

const AppUIMobile: React.FC<{
  appContext: AppContextType;
  currentPage;
  setCurrentPage;
}> = ({ appContext, currentPage, setCurrentPage }) => {
  // Hooks
  const currentAction = window.location.href.split(`/${appContext.appId}`)[1]
    ? window.location.href.split(`/${appContext.appId}/`)[1].split("/")[0]
    : "home";
  const history = useHistory();
  const [drawerOpen, setDrawerOpen] = useState<any>(false);
  const [gActions, setgActions] = useGlobal<any>("actions");
  const [filter, setFilter] = useState<any>();

  useEffect(() => {
    if (appContext.appConfig?.actions?.mobile?.displayAs === "menu") {
      setgActions({
        ...gActions,
        navigate: {
          icon: <AiOutlineMenuUnfold />,
          function: () => {
            setDrawerOpen(true);
          },
        },
      });
    } else {
      setgActions({
        ...gActions,
        navigate: undefined,
      });
    }
  }, [appContext]);

  let actions = appContext.actions;
  const groupedActions = {};

  if (filter) {
    const searcher = new FuzzySearch(actions, ["key", "label"], {});
    actions = searcher.search(filter);
  }
  if (appContext.appConfig?.actions?.group) {
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
    <>
      {appContext.app.data.menu_type !== "hidden" &&
        (appContext.appConfig?.actions?.mobile?.displayAs === "tabs" ||
          !appContext.appConfig?.actions?.mobile?.displayAs) && (
          <Tabs
            variant="scrollable"
            aria-label="App actions"
            scrollButtons="on"
            indicatorColor="primary"
            value={currentAction}
            onChange={(event, newValue) => {
              history.push(`/${appContext.appId}/${newValue}`);
            }}
          >
            <Tab value="home" label="Home" />
            {typeof actions === "object" &&
              //@ts-ignore
              appContext.actions.map((action) => {
                return (
                  <Tab
                    key={action.key}
                    value={action.key}
                    label={action.label}
                  />
                );
              })}
          </Tabs>
        )}
      <div
        style={{
          height: "100%",
          overflow: "auto",
          paddingBottom: appContext.appConfig?.actions?.mobile?.displayAs ===
            "bottom-navigation" && 54
        }}
      >
        <Switch>
          {typeof appContext.actions === "function" ? (
            <appContext.actions context={appContext} />
          ) : (
              //@ts-ignore
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
        {appContext.appConfig?.actions?.mobile?.displayAs === "menu" && (
          <SwipeableDrawer
            anchor="right"
            open={drawerOpen}
            onOpen={(event) => {
              setDrawerOpen(true);
            }}
            onClose={(event) => {
              setDrawerOpen(false);
            }}
          >
            <div style={{ backgroundColor: "#f4f5f7" }}>
              {appContext.appConfig?.actions?.filter && (
                <InputInput
                  style={{ width: "87%" }}
                  placeholder="Filter actions"
                  value={filter}
                  onChange={(value) => {
                    setFilter(value);
                  }}
                />
              )}
              <List>
                {appContext.appConfig?.actions?.group
                  ? map(groupedActions, (actions, group) => {
                    return (
                      <div key={group}>
                        {group !== "undefined" && (
                          <ListSubheader
                            color="primary"
                            style={{
                              backgroundColor: "#f4f5f7",
                              cursor: "default",
                            }}
                          >
                            {group ? group : "Other"}
                          </ListSubheader>
                        )}
                        {actions.map((action) => {
                          const ActionIcon: React.FC<{ style }> = action.icon;

                          return (
                            <ListItem
                              button
                              selected={currentPage === action.key}
                              onClick={() => {
                                setDrawerOpen(false);
                                history.push(
                                  `/${appContext.appId}/${action.key}`
                                );
                              }}
                              style={{ color: "rgb(66, 82, 110)" }}
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
                          );
                        })}
                      </div>
                    );
                  })
                  : typeof actions === "object" &&
                  actions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <ListItem
                        key={action.key}
                        button
                        onClick={() => {
                          setDrawerOpen(false);
                          history.push(`/${appContext.appId}/${action.key}`);
                        }}
                      >
                        <ListItemIcon>
                          {Icon ? <Icon /> : <FaDropbox />}
                        </ListItemIcon>
                        <ListItemText>{action.label}</ListItemText>
                      </ListItem>
                    );
                  })}
              </List>
            </div>
          </SwipeableDrawer>
        )}
        {appContext.appConfig?.actions?.mobile?.displayAs ===
          "bottom-navigation" && (
            <BottomNavigation
              value={currentAction}
              showLabels
              onChange={(event, newValue) => {
                history.push(`/${appContext.appId}/${newValue}`);
              }}
              style={{
                bottom: 0,
                position: "absolute",
                width: "100%",
                zIndex: 101,
              }}
            >
              {typeof actions === "object" &&
                //@ts-ignore
                appContext.actions.map((action) => {
                  const Icon: React.FC<{ style }> = action.icon;
                  return (
                    <BottomNavigationAction
                      key={action.key}
                      label={action.label}
                      value={action.key}
                      icon={
                        Icon ? (
                          <Icon style={{ height: 20, width: 20 }} />
                        ) : (
                            <FaLemon />
                          )
                      }
                    />
                  );
                })}
              {appContext.appConfig && appContext.appConfig.settings && (
                <BottomNavigationAction
                  key="settings"
                  label="Settings"
                  value="settings"
                  icon={<FaCogs style={{ height: 20, width: 20 }} />}
                />
              )}
            </BottomNavigation>
          )}
      </div>
    </>
  );
};

export default AppUIMobile;

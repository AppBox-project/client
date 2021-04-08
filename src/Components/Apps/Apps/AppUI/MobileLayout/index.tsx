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
  Popover,
} from "@material-ui/core";
import { useHistory, Switch, Route } from "react-router-dom";
import { FaLemon, FaDropbox, FaCogs, FaEllipsisV } from "react-icons/fa";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import FuzzySearch from "fuzzy-search";
import InputInput from "../../../../Inputs/Input";
import map from "lodash/map";
import styles from "./styles.module.scss";
import { AppContext } from "../../AppContext";

const AppUIMobile: React.FC<{
  appContext: AppContext;
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
  const [gTheme] = useGlobal<any>("theme");
  const [anchorElMoreNav, setAnchorElMoreNav] = useState();

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

  // UI
  let SingleAction: React.FC<{ context: AppContext }>;
  if (typeof appContext.actions === "function")
    SingleAction = appContext.actions;

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
          paddingBottom:
            appContext.appConfig?.actions?.mobile?.displayAs ===
              "bottom-navigation" && 54,
        }}
      >
        {SingleAction ? (
          <SingleAction context={appContext} />
        ) : (
          <Switch>
            {
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
            }
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
        )}
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
            <div className={styles.menu}>
              {appContext.appConfig?.actions?.filter && (
                <InputInput
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
                              color={
                                gTheme.palette.type === "light"
                                  ? "primary"
                                  : "default"
                              }
                              className={styles.subheader}
                            >
                              {group ? group : "Other"}
                            </ListSubheader>
                          )}
                          {actions.map((action) => {
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
                                className={styles.actionLink}
                              >
                                <ListItemIcon>
                                  <Icon
                                    color={
                                      gTheme.palette.type === "light" &&
                                      currentPage === action.key
                                        ? "primary"
                                        : "inherit"
                                    }
                                  >
                                    {typeof action?.icon === "string" ? (
                                      <FaIcon
                                        icon={action.icon || "exclamation"}
                                      />
                                    ) : (
                                      action.icon &&
                                      (<action.icon /> ? (
                                        <action.icon />
                                      ) : (
                                        "Unknown icon case?"
                                      ))
                                    )}
                                  </Icon>
                                </ListItemIcon>
                                <ListItemText
                                  color={
                                    gTheme.palette.type === "light"
                                      ? "primary"
                                      : "default" && currentPage === action.key
                                      ? "primary"
                                      : "inherit"
                                  }
                                >
                                  {action.label}
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
          "bottom-navigation" &&
          appContext.actions.length >
            (appContext?.appConfig?.settings ? 3 : 4) && (
            <Popover
              id="more-options"
              open={Boolean(anchorElMoreNav)}
              anchorEl={anchorElMoreNav}
              onClose={() => setAnchorElMoreNav(null)}
              anchorOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
            >
              <List>
                {appContext.actions
                  .slice(3, appContext.actions.length)
                  .map((action) => {
                    const Icon: React.FC<{ style }> = action.icon;
                    return (
                      <ListItem
                        key={action.key}
                        button
                        selected={currentAction === action.key}
                        onClick={() => {
                          history.push(`/${appContext.appId}/${action.key}`);
                          setAnchorElMoreNav(undefined);
                        }}
                      >
                        <ListItemIcon style={{ minWidth: 32 }}>
                          {Icon ? (
                            <Icon style={{ height: 20, width: 20 }} />
                          ) : (
                            <FaLemon />
                          )}
                        </ListItemIcon>
                        <ListItemText>{action.label}</ListItemText>
                      </ListItem>
                    );
                  })}
              </List>
            </Popover>
          )}
        {appContext.appConfig?.actions?.mobile?.displayAs ===
          "bottom-navigation" && (
          <BottomNavigation
            value={currentAction}
            showLabels
            onChange={(event, newValue) => {
              if (newValue === "more") {
                //@ts-ignore
                setAnchorElMoreNav(event.currentTarget);
              } else {
                history.push(`/${appContext.appId}/${newValue}`);
              }
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
              (appContext.actions.length >
              (appContext?.appConfig?.settings ? 3 : 4)
                ? [
                    ...appContext.actions.slice(0, 3),
                    { icon: FaEllipsisV, key: "more", label: "More" },
                  ]
                : appContext.actions
              ).map((action) => {
                const Icon: React.FC<{ style }> = action.icon;
                return (
                  <BottomNavigationAction
                    key={action.key}
                    label={action.label}
                    value={action.key}
                    color={
                      currentAction === action.key &&
                      gTheme.palette.type === "light" &&
                      "primary"
                    }
                    style={{
                      color:
                        currentAction === action.key &&
                        gTheme.palette.type !== "light" &&
                        "#fff",
                    }}
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
            {appContext?.appConfig?.settings && (
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

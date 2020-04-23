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
} from "@material-ui/core";
import { AppContextType } from "../../../../../Utils/Types";
import { useHistory, Switch, Route } from "react-router-dom";
import { FaBaseballBall, FaLemon, FaCompass } from "react-icons/fa";

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
  const [gApp] = useGlobal<any>("app");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [gButtons, setgButtons] = useGlobal<any>("buttons");

  const actionsDisplayAs = gApp
    ? gApp.data.mobileSettings
      ? gApp.data.mobileSettings.actionsDisplayAs
        ? gApp.data.mobileSettings.actionsDisplayAs
        : "default"
      : "default"
    : "default";

  useEffect(() => {
    if (actionsDisplayAs === "menu") {
      console.log("juh");

      setgButtons({
        ...gButtons,
        toggleNavigate: {
          label: "Explore actions",
          icon: FaCompass,
          action: () => {
            setDrawerOpen(true);
          },
        },
      });
    }
  }, [actionsDisplayAs]);

  return (
    <>
      {actionsDisplayAs === "tabs" ||
        (actionsDisplayAs === "default" && (
          <Tabs
            aria-label="App actions"
            scrollButtons="on"
            value={currentAction}
            onChange={(event, newValue) => {
              history.push(`/${appContext.appId}/${newValue}`);
            }}
          >
            <Tab value="home" label="Home" />
            {appContext.actions.map((action) => {
              return (
                <Tab key={action.key} value={action.key} label={action.label} />
              );
            })}
          </Tabs>
        ))}
      <div
        style={{
          height: "calc(100vh - 104px)",
          overflowInline: "scroll",
        }}
      >
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
        </Switch>
        {actionsDisplayAs === "menu" && (
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
            <List>
              {appContext.actions.map((action) => {
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
                    <ListItemIcon>{Icon ? <Icon /> : <FaLemon />}</ListItemIcon>
                    <ListItemText>{action.label}</ListItemText>
                  </ListItem>
                );
              })}
            </List>
          </SwipeableDrawer>
        )}
        {actionsDisplayAs === "bottom-navigation" && (
          <BottomNavigation
            value={currentAction}
            onChange={(event, newValue) => {
              history.push(`/${appContext.appId}/${newValue}`);
            }}
            style={{ bottom: 0, position: "absolute", width: "100%" }}
          >
            {appContext.actions.map((action) => {
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
          </BottomNavigation>
        )}
      </div>
    </>
  );
};

export default AppUIMobile;

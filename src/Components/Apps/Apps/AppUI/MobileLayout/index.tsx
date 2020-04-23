import React, { useGlobal } from "reactn";
import {
  Tabs,
  Tab,
  BottomNavigation,
  BottomNavigationAction,
} from "@material-ui/core";
import { AppContextType } from "../../../../../Utils/Types";
import { useHistory, Switch, Route } from "react-router-dom";
import { FaBaseballBall } from "react-icons/fa";

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

  const actionsDisplayAs = gApp
    ? gApp.data.mobileSettings
      ? gApp.data.mobileSettings.actionsDisplayAs
        ? gApp.data.mobileSettings.actionsDisplayAs
        : "default"
      : "default"
    : "default";

  return (
    <>
      {actionsDisplayAs === "tabs" && (
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
      )}
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
        {actionsDisplayAs === "bottom-navigation" && (
          <BottomNavigation
            value={currentAction}
            onChange={(event, newValue) => {
              history.push(`/${appContext.appId}/${newValue}`);
            }}
            showLabels
            style={{ bottom: 0, position: "absolute", width: "100%" }}
          >
            {appContext.actions.map((action) => {
              return (
                <BottomNavigationAction
                  key={action.key}
                  label={action.label}
                  value={action.key}
                  icon={<FaBaseballBall />}
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

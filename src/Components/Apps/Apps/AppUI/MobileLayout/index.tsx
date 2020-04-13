import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Tabs,
  Tab,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { AppContextType } from "../../../../../Utils/Types";
import { useHistory, Switch, Route } from "react-router-dom";

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

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            {appContext.app.data.name}
          </Typography>
          <IconButton>
            <MoreVertIcon style={{ color: "white" }} />
          </IconButton>
        </Toolbar>
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
      </AppBar>
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
      </div>
    </>
  );
};

export default AppUIMobile;

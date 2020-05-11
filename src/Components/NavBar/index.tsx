import React, { useGlobal } from "reactn";
import styles from "./styles.module.scss";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Icon,
  Button,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { map } from "lodash";

const NavBar: React.FC<{ currentApp }> = ({ currentApp }) => {
  // Vars
  const [app] = useGlobal<any>("app");
  const [navBar] = useGlobal<any>("navBar");
  // Lifecycle
  // UI
  return (
    <div className={`${styles.root}${currentApp ? ` ${styles.withApp}` : ""}`}>
      <AppBar position="static" style={{ display: "flex" }} elevation={0}>
        <Toolbar>
          {navBar.backButton.icon && navBar.backButton.url ? (
            <Link to={navBar.backButton.url} style={{ color: "white" }}>
              <IconButton edge="start" color="inherit" aria-label="menu">
                {navBar.backButton.icon}
              </IconButton>
            </Link>
          ) : navBar.backButton.function ? (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={navBar.backButton.function}
            >
              {navBar.backButton.icon}
            </IconButton>
          ) : (
            <Icon>{navBar.backButton.icon}</Icon>
          )}
          <Link to="/" style={{ flex: 1, color: "white" }}>
            <Typography variant="h6">
              {navBar.title
                ? navBar.title
                : currentApp
                ? app
                  ? app.data.name
                  : ""
                : "AppBox"}
            </Typography>
          </Link>
          {navBar.buttons &&
            map(navBar.buttons, (button, key) => {
              return (
                <Button
                  key={key}
                  startIcon={button.icon}
                  style={{ color: "white" }}
                  onClick={button.function}
                  variant={button.variant ? button.variant : "text"}
                  color="primary"
                >
                  {button.label}
                </Button>
              );
            })}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default NavBar;

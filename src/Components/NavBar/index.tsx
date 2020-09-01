import React, { useGlobal, useState } from "reactn";
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
import Search from "../Search";
import { FaSearch, FaSearchMinus } from "react-icons/fa";

const NavBar: React.FC<{ currentApp? }> = ({ currentApp }) => {
  // Vars
  const [app] = useGlobal<any>("app");
  const [page] = useGlobal<any>("page");
  const [navBar] = useGlobal<any>("navBar");
  const [actions] = useGlobal<any>("actions");
  const [isMobile] = useGlobal<any>("isMobile");
  const [noActions] = useGlobal<any>("noActions");
  const [searchExpanded, setSearchExpanded] = useState<any>(false);

  // Lifecycle
  console.log(page);

  // UI
  return (
    <div
      className={`${styles.root}${
        currentApp && !noActions ? ` ${styles.withApp}` : ""
      }${isMobile ? ` ${styles.isMobile}` : ""}`}
    >
      <AppBar
        position="static"
        className={styles.appbar}
        elevation={0}
        style={{
          ...(page.image && {
            backgroundImage: `url(${page.image})`,
            backgroundSize: "cover",
            height: "45vh",
            backgroundBlendMode: "multiply",
            backgroundColor: `rgba(${app?.data?.color?.r || 2},${
              app?.data?.color?.g || 71
            },${app?.data?.color?.b || 161},1)`,
          }),
        }}
      >
        <Toolbar>
          {isMobile && searchExpanded ? (
            <Search
              style={{ flex: 10 }}
              setSearchExpanded={setSearchExpanded}
            />
          ) : (
            <>
              {navBar.backButton &&
              navBar.backButton.icon &&
              navBar.backButton.url ? (
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
              <Typography
                variant="h6"
                style={{ color: "white", flex: 1, cursor: "default" }}
                noWrap
              >
                {navBar.title
                  ? navBar.title
                  : currentApp
                  ? app
                    ? app.data.name
                    : ""
                  : "AppBox"}
              </Typography>
              {!isMobile && (
                <Search style={{ flex: 4, maxWidth: 650, margin: "0 35px" }} />
              )}
              <div style={{ flex: 1 }} />
              {actions &&
                map(actions, (button, key) => {
                  if (button) {
                    return button.label ? (
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
                    ) : (
                      <IconButton
                        key={key}
                        onClick={button.function}
                        style={{ color: "white" }}
                      >
                        {button.icon}
                      </IconButton>
                    );
                  }
                })}
            </>
          )}
          {isMobile && (
            <IconButton
              style={{ color: "white", float: "right" }}
              onClick={() => {
                setSearchExpanded(!searchExpanded);
              }}
            >
              {searchExpanded ? (
                <FaSearchMinus style={{ width: 18 }} />
              ) : (
                <FaSearch style={{ width: 18 }} />
              )}
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default NavBar;

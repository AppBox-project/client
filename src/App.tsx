import React, { useGlobal } from "reactn";
import {
  CircularProgress,
  createMuiTheme,
  ThemeProvider,
  Hidden,
} from "@material-ui/core";
import { useState, useEffect } from "react";
import uniqid from "uniqid";
import Overview from "./Components/Overview";
import LoginPage from "./Pages/Login";
import Desktop from "./Pages/Desktop";
import { BrowserRouter } from "react-router-dom";
import Server from "./Utils/Server";
import MobileLayout from "./Pages/Mobile";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#ff4400",
    },
    secondary: {
      light: "#0066ff",
      main: "#0044ff",
      contrastText: "#ffcc00",
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
});

const App: React.FC = () => {
  const [user, setUser] = useGlobal<any>("user");

  // Lifecycle
  useEffect(() => {
    let userRequest;

    if (localStorage.getItem("username") && localStorage.getItem("token")) {
      const signInRequest = uniqid();
      Server.emit("signIn", {
        requestId: signInRequest,
        username: localStorage.getItem("username"),
        token: localStorage.getItem("token"),
      });
      Server.on(`receive-${signInRequest}`, (response) => {
        if (response.success) {
          userRequest = uniqid();

          Server.emit("listenForObjects", {
            requestId: userRequest,
            type: "user",
            filter: { "data.username": localStorage.getItem("username") },
          });
          Server.on(`receive-${userRequest}`, (response) => {
            if (response.success) {
              setUser(response.data[0]);
            } else {
              console.log(response);
            }
          });
        } else {
          console.log(response.reason);
          setUser("error");
        }
      });
    } else {
      setUser("none");
    }

    return () => {
      if (userRequest) {
        Server.emit("unlistenForObjects", { requestId: userRequest });
      }
    };
  }, []);

  // UI
  if (!user) return <CircularProgress className="center" />;
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        {user === "error" || user === "none" ? (
          <LoginPage />
        ) : (
          <>
            <Hidden xsDown>
              <Desktop />
            </Hidden>
            <Hidden smUp>
              <MobileLayout />
            </Hidden>
          </>
        )}
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;

import React, { useGlobal } from "reactn";
import {
  CircularProgress,
  createMuiTheme,
  ThemeProvider,
  Hidden,
} from "@material-ui/core";
import { useEffect } from "react";
import uniqid from "uniqid";
import LoginPage from "./Pages/Login";
import Desktop from "./Pages/Desktop";
import { BrowserRouter } from "react-router-dom";
import Server from "./Utils/Server";
import MobileLayout from "./Pages/Mobile";

const App: React.FC = () => {
  const [user, setUser] = useGlobal<any>("user");
  const [gTheme] = useGlobal<any>("theme");

  const theme = createMuiTheme(gTheme);
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

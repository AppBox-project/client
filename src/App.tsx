import React, { useGlobal } from "reactn";
import {
  CircularProgress,
  createMuiTheme,
  ThemeProvider,
  Hidden,
  Snackbar,
  Slide,
} from "@material-ui/core";
import { useEffect } from "react";
import uniqid from "uniqid";
import LoginPage from "./Pages/Login";
import Desktop from "./Pages/Desktop";
import { BrowserRouter } from "react-router-dom";
import Server from "./Utils/Server";
import MobileLayout from "./Pages/Mobile";
import { Alert } from "@material-ui/lab";
import { FaWifi } from "react-icons/fa";

const App: React.FC = () => {
  const [user, setUser] = useGlobal<any>("user");
  const [gTheme] = useGlobal<any>("theme");
  const [snackbar, setSnackbar] = useGlobal<any>("snackbar");

  const theme = createMuiTheme(gTheme);
  // Lifecycle
  useEffect(() => {
    let userRequest;

    Server.on("reconnect_attempt", () => {
      setSnackbar({
        display: true,
        message: "Connection lost. Reconnecting...",
        type: "warning",
        icon: <FaWifi />,
      });
    });

    Server.on("connect", () => {
      setSnackbar({ display: false });
    });

    Server.on("who-r-u", (previousAction) => {
      console.log("Received who-r-u");
      const signInRequest = uniqid();
      Server.emit("signIn", {
        requestId: signInRequest,
        username: localStorage.getItem("username"),
        token: localStorage.getItem("token"),
      });
      Server.on(`receive-${signInRequest}`, (response) => {
        Server.emit(previousAction.action.key, previousAction.args);
      });
    });

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
      {snackbar && (
        <Snackbar open={snackbar.display} TransitionComponent={TransitionUp}>
          <Alert icon={snackbar.icon} severity={snackbar.type}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      )}
    </ThemeProvider>
  );
};

function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}
export default App;

import React, { useGlobal } from "reactn";
import {
  CircularProgress,
  createMuiTheme,
  ThemeProvider,
  Hidden,
  Snackbar,
  Slide,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import uniqid from "uniqid";
import LoginPage from "./Pages/Login";
import Desktop from "./Pages/Desktop";
import { BrowserRouter } from "react-router-dom";
import Server from "./Utils/Server";
import MobileLayout from "./Pages/Mobile";
import { Alert } from "@material-ui/lab";
import { FaWifi } from "react-icons/fa";
import PageOnboardingNoDb from "./Pages/Onboarding/NoDB";
import PageOnboarding from "./Pages/Onboarding/Onboarding";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

const App: React.FC = () => {
  const [user, setUser] = useGlobal<any>("user");
  const [gTheme] = useGlobal<any>("theme");
  const [snackbar, setSnackbar] = useGlobal<any>("snackbar");
  const [noDb, setNoDb] = useState<any>(false);
  const [noInit, setNoInit] = useState<any>(false);

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
    Server.on("noDb", () => {
      setNoDb(true);
    });
    Server.on("noInit", () => {
      setNoInit(true);
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
          setTimeout(() => {
            Server.emit("listenForObjects", {
              requestId: userRequest,
              type: "users",
              filter: { "data.username": localStorage.getItem("username") },
            });
          }, 200); // Timeout exists to make sure we have an authenticated session. Todo: make better.

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
  if (!user && !noDb && !noInit) return <CircularProgress className="center" />;
  return (
    <ThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <BrowserRouter>
          {noDb || noInit ? (
            noInit ? (
              <PageOnboarding />
            ) : (
              <PageOnboardingNoDb />
            )
          ) : user === "error" || user === "none" ? (
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
          <Snackbar
            open={snackbar.display}
            autoHideDuration={snackbar.duration}
            TransitionComponent={TransitionUp}
            anchorOrigin={{
              vertical: snackbar.position?.vertical
                ? snackbar.position.vertical
                : "bottom",
              horizontal: snackbar.position?.horizontal
                ? snackbar.position.horizontal
                : "center",
            }}
            onClose={() => {
              setSnackbar({ ...snackbar, display: false });
            }}
          >
            <Alert icon={snackbar.icon} severity={snackbar.type}>
              {snackbar.message}
            </Alert>
          </Snackbar>
        )}
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  );
};

function TransitionUp(props) {
  return <Slide {...props} direction="up" />;
}
export default App;

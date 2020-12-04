import React, { useState, useGlobal } from "reactn";
import styles from "./styles.module.scss";
import { Tabs, Tab, Grid, Button, Typography } from "@material-ui/core";
import uniqid from "uniqid";
import Server from "../../Utils/Server";
import bg from "./bg.jpg";
import Card from "../../Components/Design/Card";
import InputInput from "../../Components/Inputs/Input";
import { Animation } from "../../Components/Apps/Apps/AppUI/Animations";
import { motion } from "framer-motion";

const LoginPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<any>(0);
  return (
    <div className={styles.root} style={{ backgroundImage: `url(${bg})` }}>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        className="center"
      >
        <Grid item xs={12} lg={3}>
          <motion.div
            style={{
              fontWeight: "bold",
              letterSpacing: "-0.04em",
              fontSize: 32,
              color: "white",
              display: "flex",
              justifyContent: "center",
            }}
            variants={{
              before: {},
              after: { transition: { staggerChildren: 0.07 } },
            }}
            initial={"before"}
            animate={"after"}
          >
            {["A", "p", "p", "B", "o", "x"].map((letter, index) => (
              <motion.div
                key={index}
                style={{ position: "relative" }} // Position elements
                variants={{
                  before: {
                    opacity: 0,
                    y: 20,
                    transition: {
                      type: "spring",
                      damping: 16,
                      stiffness: 200,
                    },
                  },
                  after: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      type: "spring",
                      damping: 16,
                      stiffness: 200,
                    },
                  },
                }}
              >
                {letter}
              </motion.div>
            ))}
          </motion.div>
          <Animation>
            <Card withBigMargin hoverable withoutPadding>
              <Tabs
                value={currentTab}
                onChange={(_, v) => {
                  setCurrentTab(v);
                }}
                indicatorColor="primary"
                textColor="primary"
                centered
              >
                <Tab label="Log in" value={0} />
                <Tab label="Register" value={1} />
              </Tabs>
              <div style={{ padding: "15px 15px 0 15px" }}>
                {currentTab === 0 && <Login />}
                {currentTab === 1 && (
                  <div style={{ marginBottom: 15 }}>
                    Registration is disabled!
                  </div>
                )}
              </div>
            </Card>
          </Animation>
        </Grid>
      </Grid>
    </div>
  );
};

const Login: React.FC = () => {
  const [user, setUser] = useState<any>({ username: "", password: "" });
  const [_, setGlobalUser] = useGlobal<any>("user");
  const [requireToken, setRequireToken] = useState<boolean>(false);
  const [failReason, setFailReason] = useState<string>();
  const [token, setToken] = useState<string>("");

  // UI
  const submit = () => {
    const requestId = uniqid();
    Server.emit("requestToken", { requestId, user });
    Server.on(`receive-${requestId}`, (response) => {
      if (response.success) {
        localStorage.setItem("username", user.username);
        localStorage.setItem("token", response.token);
        const signInRequest = uniqid();
        Server.emit("signIn", {
          requestId: signInRequest,
          username: user.username,
          token: response.token,
        });
        Server.on(`receive-${signInRequest}`, (response) => {
          if (response.success) {
            setGlobalUser(response.user);
            window.location.reload();
          } else {
            setFailReason(response.reason);
          }
        });
      } else {
        if (response.reason === "require-mfa") {
          setRequireToken(true);
        } else {
          setFailReason(response.reason);
        }
      }
    });
  };

  const submitMfa = () => {
    const requestId = uniqid();
    Server.emit("requestToken", {
      requestId,
      user,
      token,
      mfaToken: token,
    });
    Server.on(`receive-${requestId}`, (response) => {
      if (response.success) {
        localStorage.setItem("username", user.username);
        localStorage.setItem("token", response.token);
        const signInRequest = uniqid();
        Server.emit("signIn", {
          requestId: signInRequest,
          username: user.username,
          token: response.token,
        });
        Server.on(`receive-${signInRequest}`, (response) => {
          if (response.success) {
            setGlobalUser(response.user);
            window.location.reload();
          } else {
            setFailReason(response.reason);
            console.log(response);
          }
        });
      } else {
        setFailReason(response.reason);
      }
    });
  };
  return (
    <div style={{ marginTop: 10, marginBottom: 10 }}>
      {!requireToken ? (
        <>
          {failReason && (
            <Typography variant="body1" style={{ color: "red" }}>
              {failReason}
            </Typography>
          )}
          <InputInput
            name="username"
            label="Username"
            value={user.username}
            onChange={(value) => {
              setUser({ ...user, username: value });
            }}
            onEnter={submit}
          />

          <InputInput
            name="password"
            label="Password"
            type="password"
            value={user.password}
            onChange={(value) => {
              setUser({ ...user, password: value });
            }}
            onEnter={submit}
            spacing={3}
          />
          <Button fullWidth onClick={submit}>
            Sign in
          </Button>
        </>
      ) : (
        <>
          <Typography>
            Because you're clearly awesome, you've set-up 2FA to make sure
            no-one else can access this spot. Enter the code your app generated
            for you!
          </Typography>
          {failReason && (
            <Typography style={{ color: "red" }}>{failReason}</Typography>
          )}
          <InputInput
            value={token}
            onChange={(value) => setToken(value.toString())}
            label="Token"
            onEnter={submitMfa}
            autoFocus={true}
            spacing={3}
          />
          <Button fullWidth variant="contained" onClick={submitMfa}>
            Enter
          </Button>
        </>
      )}
    </div>
  );
};
export default LoginPage;

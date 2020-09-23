import React, { useState, useGlobal } from "reactn";
import styles from "./styles.module.scss";
import { motion } from "framer-motion";
import {
  Tabs,
  Tab,
  Grid,
  TextField,
  Button,
  Typography,
} from "@material-ui/core";
import uniqid from "uniqid";
import Server from "../../Utils/Server";
import bg from "./bg.jpg";
import Card from "../../Components/Design/Card";
import InputInput from "../../Components/Inputs/Input";

const LoginPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<any>(0);
  const list = {
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        ease: "easeOut",
      },
    },
    hidden: {
      opacity: 0,
      x: "-40vw",
      transition: {
        when: "afterChildren",
      },
    },
  };
  const item = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: 10 },
  };

  return (
    <Grid
      container
      style={{ backgroundImage: `url(${bg})` }}
      className={styles.root}
    >
      <Grid item xs={12} md={5}>
        <motion.div initial="hidden" animate="visible" variants={list}>
          <motion.div variants={item}>
            <Card className="center" title="Welcome to AppBox">
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
              {currentTab === 0 && <Login />}
              {currentTab === 1 && "Register"}
            </Card>
          </motion.div>
        </motion.div>
      </Grid>
    </Grid>
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
    <>
      {!requireToken ? (
        <>
          {failReason && (
            <Typography variant="body1" style={{ color: "red" }}>
              {failReason}
            </Typography>
          )}
          <InputInput
            label="Username"
            value={user.username}
            onChange={(value) => {
              setUser({ ...user, username: value });
            }}
            onEnter={submit}
          />

          <InputInput
            label="Password"
            type="password"
            value={user.password}
            onChange={(value) => {
              setUser({ ...user, password: value });
            }}
            onEnter={submit}
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
          <InputInput
            value={token}
            onChange={(value) => setToken(value)}
            label="Token"
            onEnter={submitMfa}
          />
          <Button fullWidth variant="contained" onClick={submitMfa}>
            Enter
          </Button>
        </>
      )}
    </>
  );
};
export default LoginPage;

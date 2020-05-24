import React, { useState } from "react";
import styles from "./styles.module.scss";
import bg from "./bg.jpg";
import { motion } from "framer-motion";
import { Typography, Grid, Button, CircularProgress } from "@material-ui/core";
import InputInput from "../../../Components/Inputs/Input";
import Server from "../../../Utils/Server";
import uniqid from "uniqid";

const PageOnboarding: React.FC = () => {
  // Vars
  const [user, setUser] = useState();
  const [step, setStep] = useState(1);
  // Lifecycle
  // UI
  return (
    <>
      <motion.div
        animate={{ filter: "blur(10px)" }}
        transition={{ duration: 1.6, delay: 0 }}
        className={styles.root}
        style={{ backgroundImage: `url(${bg})` }}
      />
      <motion.div
        animate={{ left: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className={styles.frame}
      >
        <div className={styles.center}>
          {step === 1 && (
            <>
              <motion.div
                animate={{ top: -100 }}
                transition={{ delay: 2.5 }}
                style={{ position: "relative" }}
              >
                <Typography variant="h4">
                  {user
                    ? `Hi, ${user.first_name}!`
                    : "Welcome to your new AppBox!"}
                </Typography>
                <Typography variant="h6">
                  Let's help you get things set-up.
                </Typography>
              </motion.div>
              <motion.div
                animate={{ left: 0 }}
                transition={{ delay: 2.5 }}
                style={{ position: "relative", left: "-100%" }}
              >
                <Typography variant="body1">Step 1: The admin</Typography>
                <Typography variant="body2">
                  Tell us a little about the person who will be running this
                  place.
                </Typography>
                <Grid container>
                  <Grid item xs={6}>
                    <InputInput
                      label="First name"
                      value={user?.first_name}
                      onChange={(value) => {
                        setUser({ ...user, first_name: value });
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <InputInput
                      label="Last name"
                      value={user?.last_name}
                      onChange={(value) => {
                        setUser({ ...user, last_name: value });
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <InputInput
                      label="Email"
                      value={user?.email}
                      onChange={(value) => {
                        setUser({ ...user, email: value });
                      }}
                    />
                  </Grid>{" "}
                  <Grid item xs={6}>
                    <InputInput
                      label="Username"
                      value={user?.username}
                      onChange={(value) => {
                        setUser({ ...user, username: value });
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <InputInput
                      label="Password"
                      type="password"
                      value={user?.password}
                      onChange={(value) => {
                        setUser({ ...user, password: value });
                      }}
                    />
                  </Grid>
                  {user?.first_name &&
                    user?.last_name &&
                    user?.email &&
                    user?.username &&
                    user?.password && (
                      <Grid item xs={12}>
                        <motion.div
                          animate={{ left: 0 }}
                          style={{ position: "relative", left: "-100%" }}
                        >
                          <Button
                            variant="contained"
                            onClick={() => {
                              setStep(2);
                            }}
                          >
                            Let's go!
                          </Button>
                        </motion.div>
                      </Grid>
                    )}
                </Grid>
              </motion.div>
            </>
          )}
          {step === 2 && (
            <motion.div
              animate={{ top: -100 }}
              transition={{ delay: 2.5 }}
              style={{ position: "relative" }}
            >
              <Typography variant="h4">Well, that was already it.</Typography>
              <Typography variant="h6">
                In the future, we'll have more set-up here.
              </Typography>
              <motion.div
                animate={{ left: 0 }}
                transition={{ delay: 2.5 }}
                style={{ position: "relative", left: "-100%" }}
              >
                <Button
                  variant="contained"
                  onClick={() => {
                    const requestId = uniqid();
                    Server.emit("initServer", { requestId, user });
                    Server.on(`receive-${requestId}`, (response) => {
                      if (response.success) {
                        window.location.reload(true);
                      } else {
                        console.log(response);
                      }
                    });
                    setStep(3);
                  }}
                >
                  Click to get started
                </Button>
              </motion.div>
            </motion.div>
          )}
          {step === 3 && <CircularProgress />}
          {step === 4 && <>Done!</>}
        </div>
      </motion.div>
    </>
  );
};

export default PageOnboarding;

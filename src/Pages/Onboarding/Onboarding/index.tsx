import React, { useState } from "react";
import styles from "./styles.module.scss";
import { AnimatePresence, motion } from "framer-motion";
import Server from "../../../Utils/Server";
import { Typography } from "@material-ui/core";
import OnboardingPage1 from "./Page-1";
import OnboardingPage2 from "./Page-2";
import uniqid from "uniqid";

const PageOnboarding: React.FC = () => {
  // Vars
  const [step, setStep] = useState<number>(1);

  // Lifecycle
  // UI
  return (
    <div className={styles.root}>
      <div className="center">
        <Typography variant="h6" className={styles.title}>
          AppBox
        </Typography>
        <AnimatePresence>
          {step === 1 && (
            <OnboardingPage1
              nextStep={() => {
                setStep(1.5);
                setTimeout(() => setStep(2), 500);
              }}
            />
          )}
          {step === 2 && (
            <OnboardingPage2
              nextStep={(user) => {
                setStep(2.5);
                const requestId = uniqid();
                Server.emit("createUser", { user, requestId });
                Server.on(`receive-${requestId}`, (response) => {
                  if (response.token) {
                    localStorage.setItem("username", user.username);
                    localStorage.setItem("token", response.token);
                    window.location.reload();
                  }
                });
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PageOnboarding;

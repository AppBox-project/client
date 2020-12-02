import { Button, Divider, Typography } from "@material-ui/core";
import { motion } from "framer-motion";
import React from "react";
import { Animation } from "../../../Components/Apps/Apps/AppUI/Animations";
import Card from "../../../Components/Design/Card";

const OnboardingPage1: React.FC<{ nextStep: () => void }> = ({ nextStep }) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 150,
      }}
      exit={{
        opacity: 0,
        y: 150,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
    >
      <Card
        style={{ height: 500, width: 400 }}
        hoverable
        title="Welcome to AppBox!"
        centerTitle
        titleDivider
        titleInPrimaryColor
      >
        <Typography variant="body2">
          AppBox will be the new home for your information. Since this is the
          first time you've started this app, we'll help you get things up and
          running fast.
        </Typography>
        <Typography variant="body2" style={{ marginTop: 15 }}>
          We'll make you an account with administrator rights and install a few
          apps, should you want that.
        </Typography>
        <Button
          fullWidth
          color="primary"
          variant="contained"
          style={{
            position: "absolute",
            bottom: 15,
            width: "calc(100% - 30px)",
          }}
          onClick={nextStep}
        >
          Get started
        </Button>
      </Card>
    </motion.div>
  );
};

export default OnboardingPage1;

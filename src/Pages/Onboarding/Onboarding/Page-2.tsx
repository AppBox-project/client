import { Button, Divider, Grid, Typography } from "@material-ui/core";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { Animation } from "../../../Components/Apps/Apps/AppUI/Animations";
import Card from "../../../Components/Design/Card";
import InputDate from "../../../Components/Inputs/Date";
import InputInput from "../../../Components/Inputs/Input";
import { sub } from "date-fns";

interface UserType {
  first_name: string;
  last_name: string;
  birthday: Date;
  email: string;
  username: string;
  password: string;
}

const OnboardingPage2: React.FC<{ nextStep: (user: UserType) => void }> = ({
  nextStep,
}) => {
  const [user, setUser] = useState<UserType>({
    first_name: "",
    last_name: "",
    email: "",
    birthday: sub(new Date(), { years: 30 }),
    password: "",
    username: "",
  });

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
        style={{ height: 600, width: 400 }}
        hoverable
        centerTitle
        titleInPrimaryColor
        titleDivider
        title="Who are you?"
      >
        <Typography variant="body1">
          Please provide your information, so we can create an account for you.
        </Typography>
        <Typography variant="body2" style={{ marginTop: 15 }}>
          The account we'll create will get administrator rights. Please enter
          the information from the user that will manage the application.
        </Typography>
        <Divider style={{ margin: "15px 0" }} />
        <Grid container direction="row" justify="center" alignItems="center">
          <Grid xs={6}>
            <InputInput
              label="First name"
              value={user.first_name}
              onChange={(value: string) =>
                setUser({ ...user, first_name: value })
              }
            />
          </Grid>
          <Grid xs={6}>
            <InputInput
              label="Last name"
              value={user.last_name}
              onChange={(value: string) =>
                setUser({ ...user, last_name: value })
              }
            />
          </Grid>
          <Grid xs={12}>
            <InputDate
              label="Birth date"
              value={user.birthday}
              onChange={(date) => setUser({ ...user, birthday: date })}
            />
          </Grid>
          <Grid xs={12}>
            <InputInput
              label="E-mail"
              type="email"
              value={user.email}
              onChange={(value: string) => setUser({ ...user, email: value })}
            />
          </Grid>
          <Grid xs={12}>
            <InputInput
              label="Username"
              value={user.username}
              onChange={(value: string) =>
                setUser({ ...user, username: value })
              }
            />
          </Grid>
          <Grid xs={12}>
            <InputInput
              label="Password"
              type="password"
              value={user.password}
              onChange={(value: string) =>
                setUser({ ...user, password: value })
              }
            />
          </Grid>
        </Grid>
        <Button
          fullWidth
          color="primary"
          variant="contained"
          style={{
            position: "absolute",
            bottom: 15,
            left: 15,
            width: "calc(100% - 30px)",
          }}
          onClick={() => {
            nextStep(user);
          }}
        >
          Get started
        </Button>
      </Card>
    </motion.div>
  );
};

export default OnboardingPage2;

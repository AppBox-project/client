import { Box, CircularProgress, Grid, Typography } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { AppContextType, SystemTaskType } from "../../Utils/Types";
import { StoreAppType } from "./Types";

const Install: React.FC<{
  context: AppContextType;
  choices: {};
  app: StoreAppType;
}> = ({ context, choices, app }) => {
  const [task, setTask] = useState<SystemTaskType>();

  useEffect(() => {
    if (!task) {
      let request;
      context.addObject(
        "system-tasks",
        {
          type: "App install",
          name: `Installling ${app.data.name}`,
          description: `Triggered manually`,
          when: "asap",
          action: "app-install",
          state: "Waiting...",
          done: false,
          arguments: { app, choices },
          progress: 0,
          target: "Supervisor",
        },
        (response) => {
          context.getObjects(
            "system-tasks",
            { _id: response.data._id },
            (response) => {
              setTask(response.data[0]);
              if (response.data[0].data?.progress === 100) {
                setTimeout(() => {
                  window.location.href = window.location.href;
                }, 1000);
              }
            }
          );
        }
      );
    }
  }, [task]);

  // UI
  if (!task) return <context.UI.Loading />;
  return (
    <context.UI.Animations.AnimationContainer>
      <context.UI.Animations.AnimationItem>
        <Grid container justify="center" alignItems="center">
          <Grid xs={12} md={3}>
            <context.UI.Design.Card
              withBigMargin
              style={{ textAlign: "center" }}
            >
              <Box position="relative" display="inline-flex">
                <CircularProgress
                  variant="static"
                  value={task.data.progress}
                  color="primary"
                  style={{ height: 150, width: 150 }}
                />
                <Box
                  top={0}
                  left={0}
                  bottom={0}
                  right={0}
                  position="absolute"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Typography
                    component="div"
                    color="textSecondary"
                    style={{ display: "block" }}
                  >{`${Math.round(task.data.progress)}%`}</Typography>
                </Box>
              </Box>

              <Typography variant="h6">{task.data.state}</Typography>
            </context.UI.Design.Card>
          </Grid>
        </Grid>
      </context.UI.Animations.AnimationItem>
    </context.UI.Animations.AnimationContainer>
  );
};

export default Install;

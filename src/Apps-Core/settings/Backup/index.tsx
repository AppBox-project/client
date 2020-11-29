import React from "reactn";
import { AppContextType } from "../../../Utils/Types";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Grid,
  Typography,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import { FaHistory } from "react-icons/fa";

const AppSettingsBackup: React.FC<{
  match: { isExact: boolean };
  context: AppContextType;
  action: string;
}> = ({ context, action, match: { isExact } }) => {
  // Vars
  const [task, setTask] = useState<any>();

  // Lifecycle

  useEffect(() => {
    let hasTask = false;
    const request = context.getObjects(
      "system-task",
      {
        "data.action": "backup",
      },
      (response) => {
        if (response.success) {
          if (
            response.data.length > 0 &&
            (!response.data[response.data.length - 1].data.done || hasTask)
          ) {
            setTask(response.data[response.data.length - 1]);
            hasTask = true;
          }
        } else {
          console.log(response);
        }
      }
    );
    return () => request.stop();
  }, []);

  // UI
  return (
    <context.UI.Animations.AnimationContainer>
      <context.UI.Animations.AnimationItem>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          style={{ marginTop: 75 }}
        >
          <Grid item xs={12} md={4}>
            {task ? (
              <context.UI.Design.Card withBigMargin title="Backup in-progress">
                <div style={{ textAlign: "center" }}>
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
                </div>
              </context.UI.Design.Card>
            ) : (
              <context.UI.Design.Card withBigMargin title="Backup system">
                <Avatar
                  color="primary"
                  style={{ width: 60, height: 60, margin: "15px auto" }}
                >
                  <FaHistory style={{ width: 32, height: 32 }} />
                </Avatar>
                <Typography variant="body1">
                  The process designer backs up automatically every week. To
                  create a backup manually, press the button below.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ margin: "15px 0 0 0" }}
                  fullWidth
                  onClick={() => {
                    context.addObject(
                      "system-task",
                      {
                        type: "Database export",
                        name: `Backing up database`,
                        description: `Triggered manually`,
                        when: "asap",
                        action: "backup",
                        done: false,
                        arguments: undefined,
                        progress: 0,
                        state: "Starting",
                        target: "Supervisor",
                      },
                      (response) => {}
                    );
                  }}
                >
                  Start backup
                </Button>
              </context.UI.Design.Card>
            )}
          </Grid>
        </Grid>
      </context.UI.Animations.AnimationItem>
    </context.UI.Animations.AnimationContainer>
  );
};

export default AppSettingsBackup;

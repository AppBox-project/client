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
import { FaDownload } from "react-icons/fa";

const AppSettingsUpdate: React.FC<{
  match: { isExact: boolean };
  context: AppContextType;
  action: string;
}> = ({ context, action, match: { isExact } }) => {
  // Vars
  const [upgradeTask, setUpgradeTask] = useState<any>();

  // Lifecycle
  useEffect(() => {
    let hasTask = false;
    const request = context.getObjects(
      "system-task",
      { "data.action": "box-update" },
      (response) => {
        if (response.success) {
          if (
            response.data.length > 0 &&
            (!response.data[response.data.length - 1].data.done || hasTask)
          ) {
            setUpgradeTask(response.data[response.data.length - 1]);
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
            {upgradeTask ? (
              <context.UI.Design.Card withBigMargin title="Update in-progress">
                <div style={{ textAlign: "center" }}>
                  <Box position="relative" display="inline-flex">
                    <CircularProgress
                      variant="static"
                      value={upgradeTask.data.progress}
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
                      >{`${Math.round(
                        upgradeTask.data.progress
                      )}%`}</Typography>
                    </Box>
                  </Box>

                  <Typography variant="h6">{upgradeTask.data.state}</Typography>
                </div>
              </context.UI.Design.Card>
            ) : (
              <context.UI.Design.Card withBigMargin title="Update system">
                <Avatar
                  color="primary"
                  style={{ width: 60, height: 60, margin: "15px auto" }}
                >
                  <FaDownload style={{ width: 32, height: 32 }} />
                </Avatar>
                <Typography variant="body1">
                  The process designer checks for updates daily, but if you want
                  to check for updates manually, use this button.
                </Typography>
                <Button
                  disabled={upgradeTask !== undefined}
                  variant="contained"
                  color="primary"
                  fullWidth
                  style={{ margin: "15px 0 0 0" }}
                  onClick={() => {
                    context.addObject(
                      "system-task",
                      {
                        type: "Box update",
                        name: `Update box software`,
                        description: `Triggered manually`,
                        when: "asap",
                        action: "box-update",
                        done: false,
                        arguments: undefined,
                        progress: 0,
                        state: "Looking for client updates",
                        target: "Supervisor",
                      },
                      (response) => {}
                    );
                  }}
                >
                  Start upgrade
                </Button>
              </context.UI.Design.Card>
            )}
          </Grid>
        </Grid>
      </context.UI.Animations.AnimationItem>
    </context.UI.Animations.AnimationContainer>
  );
};

export default AppSettingsUpdate;

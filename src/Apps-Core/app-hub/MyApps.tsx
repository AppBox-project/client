import React from "react";
import { useEffect, useState } from "reactn";
import { AppContextType, AppType, TaskType } from "../../Utils/Types";
import * as icons from "react-icons/fa";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@material-ui/core";
import { Link } from "react-router-dom";

const AppHubMyApps: React.FC<{
  match: { isExact: boolean };
  context: AppContextType;
  action: string;
}> = ({ context }) => {
  // Vars
  const [apps, setApps] = useState<AppType[]>();
  const [task, setTask] = useState<TaskType>();

  // Lifecycle
  useEffect(() => {
    const request = context.getObjects(
      "apps",
      { "data.core": { $ne: true } },
      (response) => {
        if (response.success) {
          setApps(response.data);
        } else {
          console.log(response);
        }
      }
    );

    return () => {
      request.stop();
    };
  }, []);

  // UI
  if (!apps) return <context.UI.Loading />;
  return task ? (
    <Grid container justify="center" alignItems="center">
      <Grid item xs={12} md={4}>
        <context.UI.Animations.AnimationContainer>
          <context.UI.Animations.AnimationItem>
            <context.UI.Design.Card
              withBigMargin
              style={{ textAlign: "center" }}
              title="Updating apps"
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
          </context.UI.Animations.AnimationItem>
        </context.UI.Animations.AnimationContainer>
      </Grid>
    </Grid>
  ) : (
    <context.UI.Animations.AnimationContainer>
      <context.UI.Animations.AnimationItem>
        <Button
          style={{
            color: "white",
            margin: 15,
            display: "inline-block",
          }}
          fullWidth
          startIcon={<icons.FaFileDownload />}
          onClick={() => {
            context.addObject(
              "system-tasks",
              {
                type: "Update apps",
                name: "Update apps",
                description: "Triggered manually",
                when: "asap",
                action: "update-apps",
                done: false,
                progress: 0,
                state: "Waiting...",
                target: "Supervisor",
              },
              (response) => {
                if (response.success) {
                  const request = context.getObjects(
                    "system-tasks",
                    { _id: response.data._id },
                    (response) => {
                      if (response.success) {
                        setTask(response.data[0]);
                        if (response.data[0].data.progress === 100) {
                          request.stop();
                          window.location.href = window.location.href;
                        }
                      } else {
                        console.log(response);
                      }
                    }
                  );
                } else {
                  console.log(response);
                }
              }
            );
          }}
        >
          Update all
        </Button>
      </context.UI.Animations.AnimationItem>
      <context.UI.Animations.AnimationItem>
        <context.UI.Design.Card title="Apps" withBigMargin>
          <List>
            {apps.map((app) => {
              const Icon = icons[app.data.icon];
              return (
                <Link to={`/app-hub/browse/${app.data.id}`} key={app._id}>
                  <ListItem>
                    <ListItemIcon>
                      <Avatar
                        style={{
                          backgroundColor: `rgb(${app.data.color.r},${app.data.color.g},${app.data.color.b})`,
                        }}
                      >
                        <Icon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText primary={app.data.name} />
                  </ListItem>
                </Link>
              );
            })}
          </List>
        </context.UI.Design.Card>
      </context.UI.Animations.AnimationItem>
    </context.UI.Animations.AnimationContainer>
  );
};

export default AppHubMyApps;

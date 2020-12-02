import React, { useState } from "react";
import { AppContextType, TaskType } from "../../../Utils/Types";
import {
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Typography,
} from "@material-ui/core";
import packageJson from "../../../../package.json";
import { FaEye, FaPowerOff, FaRunning, FaServer } from "react-icons/fa";

const AppSettingsAbout: React.FC<{
  match: { isExact: boolean };
  context: AppContextType;
  action: string;
}> = ({ context, action, match: { isExact } }) => {
  // Vars
  const [task, setTask] = useState<TaskType>();

  // Lifecycle

  // Functions
  const addTask = (type) => {
    context.addObject(
      "system-tasks",
      {
        name: `Restart ${type}`,
        description: "Triggered manually",
        action: `restart-${type}`,
        progress: 0,
        state: "Queued",
        target: "Supervisor",
      },
      (response) => {
        if (response.success) {
          setTask(response.data);
        } else {
          console.log(response);
        }
      }
    );
  };

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
            <context.UI.Design.Card
              withBigMargin
              style={{ textAlign: "center" }}
            >
              <Typography variant="h4">About AppBox</Typography>
              <Typography variant="body1">
                A very difficult hobby project.
              </Typography>
              <br />
              <Typography variant="body2">
                Last update is {packageJson.version}: {packageJson.description}
              </Typography>
              {task ? (
                <Typography>{task.data.state}</Typography>
              ) : (
                <List style={{ textAlign: "left" }}>
                  <ListSubheader>Server control</ListSubheader>
                  <ListItem button onClick={() => addTask("system")}>
                    <ListItemIcon>
                      <FaPowerOff />
                    </ListItemIcon>
                    <ListItemText>Restart all</ListItemText>
                  </ListItem>
                  <Divider />
                  <ListItem button onClick={() => addTask("supervisor")}>
                    <ListItemIcon>
                      <FaEye />
                    </ListItemIcon>
                    <ListItemText>Restart supervisor</ListItemText>
                  </ListItem>
                  <ListItem button onClick={() => addTask("server")}>
                    <ListItemIcon>
                      <FaServer />
                    </ListItemIcon>
                    <ListItemText>Restart server</ListItemText>
                  </ListItem>
                  <ListItem button onClick={() => addTask("engine")}>
                    <ListItemIcon>
                      <FaRunning />
                    </ListItemIcon>
                    <ListItemText>Restart engine</ListItemText>
                  </ListItem>
                </List>
              )}
            </context.UI.Design.Card>
          </Grid>
        </Grid>
      </context.UI.Animations.AnimationItem>
    </context.UI.Animations.AnimationContainer>
  );
};
export default AppSettingsAbout;

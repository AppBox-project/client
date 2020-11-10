import React, { useState } from "react";
import { AppContextType, TaskType } from "../../../Utils/Types";
import {
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
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
      "system-task",
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
    <div style={{ textAlign: "center" }}>
      <Typography variant="h4" style={{ marginTop: "40vh" }}>
        About AppBox
      </Typography>
      <Typography variant="body1">A very difficult hobby project.</Typography>
      <br />
      <Typography variant="body2">
        Last update is {packageJson.version}: {packageJson.description}
      </Typography>
      <Grid container justify="center" alignItems="center">
        <Grid item xs={12} md={4}>
          <context.UI.Design.Card title="Server control" withBigMargin>
            {task ? (
              <Typography>{task.data.state}</Typography>
            ) : (
              <List>
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
    </div>
  );
};
export default AppSettingsAbout;

import React, { useState, useEffect } from "react";
import { AppContextType } from "../../../Utils/Types";
import styles from "./styles.module.scss";
import {
  Paper,
  Typography,
  Grid,
  Fab,
  Toolbar,
  Tooltip,
  IconButton,
  CircularProgress,
} from "@material-ui/core";
import { FaDownload, FaAngleLeft } from "react-icons/fa";
import Server from "../../../Utils/Server";
import uniqid from "uniqid";

const axios = require("axios");

const AppAHViewApp: React.FC<{
  context: AppContextType;
  match: { params: { appId } };
}> = ({
  match: {
    params: { appId },
  },
  context,
}) => {
  // Vars
  const [app, setApp] = useState();
  const [requestId] = useState(uniqid());
  const [currentTask, setCurrentTask] = useState();

  // Lifecycle
  useEffect(() => {
    axios
      .get(`https://appbox.vicvan.co/api/appbox-app/read/?key=${appId}`)
      .then((response) => {
        setApp(response.data[0]);
      });
    Server.on(`receive-${requestId}`, (taskId) => {
      context.getObjects("system-task", { _id: taskId }, (response) => {
        if (response.success) {
          setCurrentTask(response.data[0]);
          if (response.data[0].data.progress === 100) {
            location.reload();
          }
        } else {
          console.log(response);
        }
      });
    });
  }, []);

  // UI
  if (!app) return <context.UI.Loading />;
  return (
    <div className={styles.root}>
      <div
        className={styles.background}
        style={{ backgroundImage: `url(${app.data.banner})` }}
      />
      {!currentTask && (
        <Paper className={styles.container}>
          <Grid container>
            <Tooltip placement="right" title="Download and install">
              <Grid item xs={1}>
                <Fab
                  color="primary"
                  onClick={() => {
                    Server.emit("installApp", { requestId, appId });
                  }}
                >
                  <FaDownload />
                </Fab>
              </Grid>
            </Tooltip>
            <Grid item xs={11}>
              <Typography variant="h4">{app.data.name}</Typography>
              <Typography variant="h6">By {app.data.author}</Typography>
            </Grid>
          </Grid>
          <div
            style={{
              height: 300,
              backgroundColor: "red",
              textAlign: "center",
            }}
          >
            Images
          </div>
          <Typography variant="body1">
            <div dangerouslySetInnerHTML={{ __html: app.data.description }} />
          </Typography>
        </Paper>
      )}
      {currentTask && (
        <div className={"center"}>
          <CircularProgress
            color="primary"
            style={{ height: 250, width: 250 }}
            thickness={2}
            variant={
              currentTask.data.progress === 0 ? "indeterminate" : "determinate"
            }
            value={currentTask.data.progress}
          />
          <br />
          <Typography
            variant="h6"
            style={{ textAlign: "center", position: "relative", top: -145 }}
          >
            {currentTask.data.state}
          </Typography>
        </div>
      )}
    </div>
  );
};

export default AppAHViewApp;

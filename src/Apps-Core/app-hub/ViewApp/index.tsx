import React, { useState, useEffect } from "react";
import { AppContextType, AppType } from "../../../Utils/Types";
import styles from "./styles.module.scss";
import {
  Paper,
  Typography,
  Grid,
  Fab,
  Tooltip,
  CircularProgress,
  Button,
} from "@material-ui/core";
import { FaDownload } from "react-icons/fa";
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
  const [app, setApp] = useState<any>();
  const [localApp, setLocalApp] = useState<AppType>();
  const [requestId] = useState<any>(uniqid());
  const [currentTask, setCurrentTask] = useState<any>();

  // Lifecycle
  useEffect(() => {
    axios
      .get(
        `https://appbox.vicvancooten.nl/api/appbox-app/read/?baseUrl=base&key=${appId}`
      )
      .then((response) => {
        setApp(response.data[0]);
      });
    Server.on(`receive-${requestId}`, (taskId) => {
      context.getObjects("system-task", { _id: taskId }, (response) => {
        if (response.success) {
          setCurrentTask(response.data[0]);
          if (response.data[0].data.progress === 100) {
            window.location.reload();
          }
        } else {
          console.log(response);
        }
      });
    });

    const localAppRequest = context.getObjects(
      "app",
      { "data.id": appId },
      (response) => {
        if (response.success) {
          setLocalApp(response.data[0]);
        } else {
          console.log(response);
        }
      }
    );

    return () => localAppRequest.stop();
  }, [appId]);

  // UI
  if (!app) return <context.UI.Loading />;
  return (
    <div className={styles.root}>
      <div
        className={styles.background}
        style={{ backgroundImage: `url(${app?.data?.banner?.url})` }}
      />
      {!currentTask && (
        <Paper className={styles.container}>
          <Grid container spacing={3}>
            <Grid item xs={1}>
              {localApp ? (
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    context.setDialog({
                      display: true,
                      title: "Delete data from app?",
                      content:
                        "If any data belongs to this app, what do you want to do?",
                      buttons: [
                        {
                          label: (
                            <Typography style={{ color: "green" }}>
                              Keep data
                            </Typography>
                          ),
                          onClick: () => {
                            Server.emit("uninstallApp", {
                              requestId,
                              appId,
                              removeData: false,
                            });
                          },
                        },
                        {
                          label: (
                            <Typography style={{ color: "red" }}>
                              Delete data
                            </Typography>
                          ),
                          onClick: () => {
                            Server.emit("uninstallApp", {
                              requestId,
                              appId,
                              removeData: true,
                            });
                          },
                        },
                      ],
                    });
                  }}
                >
                  Uninstall
                </Button>
              ) : (
                <Tooltip placement="right" title="Download and install">
                  <Fab
                    color="primary"
                    onClick={() => {
                      Server.emit("installApp", { requestId, appId });
                    }}
                  >
                    <FaDownload />
                  </Fab>
                </Tooltip>
              )}
            </Grid>
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

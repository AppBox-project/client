import React, { useState } from "react";
import InputInput from "../../Components/Inputs/Input";
import { Typography, Divider, Grid, Avatar } from "@material-ui/core";
import { AppType } from "../../Utils/Types";
import { useHistory } from "react-router-dom";
import styles from "./styles.module.scss";
import Server from "../../Utils/Server";
import Card from "../../Components/Design/Card";
import FaIcon from "../../Components/Icons";

const AppBarAppList: React.FC<{
  appList: AppType[];
  closePopover: () => void;
  userAppList: string[];
}> = ({ appList, closePopover, userAppList }) => {
  // States
  const [filter, setFilter] = useState<string>("");
  const history = useHistory();

  // Lifecycle
  // UI
  return (
    <Card style={{ display: "flex", height: "100%", flexDirection: "column" }}>
      <div style={{ height: 80 }}>
        <InputInput
          autoFocus
          style={{ float: "right", width: "30%" }}
          placeholder="Filter"
          value={filter}
          onChange={(value) => setFilter(value.toString())}
        />
        <Typography variant="h6">All apps</Typography>
        <Typography variant="body2">Right-click to pin.</Typography>
        <Divider style={{ margin: 15 }} />
      </div>

      <Grid container style={{ overflowX: "hidden" }}>
        {appList.map((app) => {
          return (
            <Grid
              key={app._id}
              xs={3}
              className={styles.appListApp}
              onClick={() => {
                history.push(`/${app.data.id}`);
                closePopover();
              }}
              onContextMenu={(event) => {
                // Add to users favorites
                if (userAppList.includes(app._id)) {
                  console.log("Remove from favorites");
                  Server.emit("setUserSetting", {
                    key: "applist",
                    value: [...userAppList, app._id],
                  });
                  userAppList.splice(userAppList.indexOf(app._id), 1);
                  Server.emit("setUserSetting", {
                    key: "applist",
                    value: userAppList,
                  });
                } else {
                  // Add to favorites
                  Server.emit("setUserSetting", {
                    key: "applist",
                    value: [...userAppList, app._id],
                  });

                  console.log("pin to favorites");
                }
                event.preventDefault();
              }}
            >
              <Avatar
                variant="rounded"
                style={{
                  backgroundColor: `rgb(${app.data.color.r},${app.data.color.g},${app.data.color.b})`,
                  textAlign: "center",
                  width: 55,
                  height: 55,
                  margin: "0 auto",
                  transition: "all 1s",
                }}
              >
                <FaIcon icon={app.data.icon} className={styles.icon} />
              </Avatar>
              <Typography style={{ fontSize: 14 }}>{app.data.name}</Typography>
            </Grid>
          );
        })}
      </Grid>
    </Card>
  );
};

export default AppBarAppList;

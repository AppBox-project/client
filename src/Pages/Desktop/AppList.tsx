import React, { useState } from "react";
import InputInput from "../../Components/Inputs/Input";
import { Typography, Divider, Grid, Avatar } from "@material-ui/core";
import { AppType } from "../../Utils/Types";
import * as icons from "react-icons/fa";
import { useHistory } from "react-router-dom";

const AppBarAppList: React.FC<{
  appList: AppType[];
  closePopover: () => void;
}> = ({ appList, closePopover }) => {
  // States
  const [filter, setFilter] = useState<string>("");
  const history = useHistory();

  // Lifecycle
  // UI
  return (
    <div style={{ display: "flex", height: "100%", flexDirection: "column" }}>
      <div style={{ height: 120 }}>
        <InputInput
          autoFocus
          style={{ float: "right", width: "30%" }}
          placeholder="Filter"
          value={filter}
          onChange={(value) => setFilter(value)}
        />
        <Typography variant="h6">All apps</Typography>
        <Divider style={{ margin: 15 }} />
      </div>

      <Grid container spacing={10} style={{ flex: 1, overflowX: "hidden" }}>
        {appList.map((app) => {
          const Icon = icons[app.data.icon];

          return (
            <Grid
              key={app._id}
              xs={4}
              style={{
                textAlign: "center",
                marginBottom: 35,
                cursor: "pointer",
              }}
              onClick={() => {
                history.push(`/${app.data.id}`);
                closePopover();
              }}
            >
              <Avatar
                variant="rounded"
                style={{
                  margin: "0 auto",
                  width: 48,
                  height: 48,
                  transition: "all 1s",
                  backgroundColor: `rgb(${app.data.color.r},${app.data.color.g},${app.data.color.b})`,
                }}
              >
                <Icon />
              </Avatar>
              <Typography style={{ fontSize: 14 }}>{app.data.name}</Typography>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default AppBarAppList;

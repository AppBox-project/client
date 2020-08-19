import React from "react";
import { useState, useEffect } from "reactn";
import { Skeleton } from "@material-ui/lab";
import styles from "./styles.module.scss";
import * as icons from "react-icons/fa";
import { Avatar, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import { WidgetContextType, AppType } from "../../../../Utils/Types";
import WidgetContext from "../../../../Components/Apps/Apps/WidgetContext";

const WidgetAppLauncher: React.FC<{ context: WidgetContext }> = ({
  context,
}) => {
  // Vars
  const [apps, setApps] = useState<AppType[]>();

  // Lifecycle
  useEffect(() => {
    context.getObjects("app", {}, (response) => {
      if (response.success) {
        setApps(response.data);
      } else {
        console.log(response);
      }
    });
  });

  // UI
  if (!apps) return <LoadingSkeleton />;
  return (
    <div className={styles.root}>
      {apps.map((app) => {
        const Icon = icons[app.data.icon];
        return (
          <div className={styles.appItem}>
            <Link className="no-link" to={`/${app.data.id}`}>
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
                <Icon style={{ width: 38, height: 38 }} />
              </Avatar>
              <Typography noWrap style={{ fontSize: 14 }}>
                {app.data.name}
              </Typography>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

const LoadingSkeleton: React.FC = () => {
  return <Skeleton />;
};

export default WidgetAppLauncher;

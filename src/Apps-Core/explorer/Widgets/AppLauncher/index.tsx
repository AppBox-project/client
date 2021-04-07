import React from "react";
import { useState, useEffect } from "reactn";
import { Skeleton } from "@material-ui/lab";
import styles from "./styles.module.scss";
import { Avatar, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import { AppType } from "../../../../Utils/Types";
import WidgetContext from "../../../../Components/Apps/Apps/WidgetContext";
import FaIcon from "../../../../Components/Icons";

const WidgetAppLauncher: React.FC<{ context: WidgetContext }> = ({
  context,
}) => {
  // Vars
  const [apps, setApps] = useState<AppType[]>();

  // Lifecycle
  useEffect(() => {
    const request = context.getObjects("apps", {}, (response) => {
      if (response.success) {
        setApps(response.data);
      } else {
        console.log(response);
      }
    });

    return () => {
      request.stop();
    };
  }, [context]);

  // UI
  if (!apps) return <LoadingSkeleton />;
  return (
    <div className={styles.root}>
      {apps.map((app) => (
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
              <FaIcon icon={app.data.icon} className={styles.icon} />
            </Avatar>
            <Typography noWrap className={styles.title}>
              {app.data.name}
            </Typography>
          </Link>
        </div>
      ))}
    </div>
  );
};

const LoadingSkeleton: React.FC = () => {
  return <Skeleton />;
};

export default WidgetAppLauncher;

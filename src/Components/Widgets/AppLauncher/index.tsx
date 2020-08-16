import React from "react";
import { WidgetContextType, AppType } from "../../../Utils/Types";
import { useState, useEffect } from "reactn";
import { Skeleton } from "@material-ui/lab";

const WidgetAppLauncher: React.FC<{ context: WidgetContextType }> = ({
  context,
}) => {
  // Vars
  const [apps, setApps] = useState<AppType>();

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
  return <>App launcher</>;
};

const LoadingSkeleton: React.FC = () => {
  return <Skeleton />;
};

export default WidgetAppLauncher;

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
import { FaBell, FaEye, FaPowerOff, FaRunning, FaServer } from "react-icons/fa";
import { useEffect } from "reactn";
import SettingsSystemDetail from "./Detail";

const AppSettingsSystem: React.FC<{
  match: { isExact: boolean };
  context: AppContextType;
  action: string;
}> = ({ context, action, match: { isExact } }) => {
  // Vars
  const [externalApps, setExternalApps] = useState<{}>();

  // Lifecycle
  useEffect(() => {}, []);
  // Functions
  // UI
  return (
    <context.UI.Layouts.ListDetailLayout
      title="System settings"
      context={context}
      baseUrl="/settings/system"
      list={[
        {
          label: "Notification settings",
          id: "notification",
          icon: FaBell,
        },
      ]}
      DetailComponent={SettingsSystemDetail}
    />
  );
};
export default AppSettingsSystem;

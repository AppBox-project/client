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
import { useEffect } from "reactn";

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
  return <>{externalApps ? "Test" : <context.UI.Loading />}</>;
};
export default AppSettingsSystem;

import React from "react";
import { AppContextType } from "../../../Utils/Types";

const AppSettingsProcesses: React.FC<{
  match: { isExact: boolean };
  context: AppContextType;
  action: string;
}> = ({ context, action, match: { isExact } }) => {
  return <>Processes</>;
};

export default AppSettingsProcesses;

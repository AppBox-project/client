import React from "react";
import { AppContextType } from "../../../Utils/Types";

const AppAHMyApps: React.FC<{
  match: { isExact: boolean };
  context: AppContextType;
  action: string;
}> = ({ context, action, match: { isExact } }) => {
  return <>My Apps</>;
};

export default AppAHMyApps;

import React from "react";
import { AppContextType } from "../../../Utils/Types";

const AppAHBrowse: React.FC<{
  match: { isExact: boolean };
  context: AppContextType;
  action: string;
}> = ({ context, action, match: { isExact } }) => {
  return <>Browse</>;
};

export default AppAHBrowse;

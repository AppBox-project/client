import React from "reactn";
import { AppContextType } from "../../../Utils/Types";
import { Button, Typography } from "@material-ui/core";
import { useState } from "react";

const AppSettingsBackup: React.FC<{
  match: { isExact: boolean };
  context: AppContextType;
  action: string;
}> = ({ context, action, match: { isExact } }) => {
  // Vars

  // Lifecycle

  // UI
  return <>TODO: Make a database upgrade tool, export mongoDB</>;
};

export default AppSettingsBackup;

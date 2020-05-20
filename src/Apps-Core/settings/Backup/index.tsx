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
  return (
    <div className="center">
      TODO: Make a database upgrade tool, export mongoDB
    </div>
  );
};

export default AppSettingsBackup;

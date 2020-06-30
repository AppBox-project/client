import React from "react";
import { AppContextType } from "../../../Utils/Types";
import { Typography } from "@material-ui/core";
import packageJson from "../../../../package.json";

const AppSettingsAbout: React.FC<{
  match: { isExact: boolean };
  context: AppContextType;
  action: string;
}> = ({ context, action, match: { isExact } }) => {
  return (
    <div style={{ textAlign: "center" }}>
      <Typography variant="h4" style={{ marginTop: "40vh" }}>
        About AppBox
      </Typography>
      <Typography variant="body1">A very difficult hobby project.</Typography>
      <br />
      <Typography variant="body2">
        Last update is {packageJson.version}: {packageJson.description}
      </Typography>
    </div>
  );
};
export default AppSettingsAbout;

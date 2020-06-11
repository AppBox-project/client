import React from "react";
import { Typography } from "@material-ui/core";

const TriggerEditor: React.FC<{ trigger }> = ({ trigger }) => {
  return (
    <>
      <Typography variant="h6">{trigger.label}</Typography>
    </>
  );
};

export default TriggerEditor;

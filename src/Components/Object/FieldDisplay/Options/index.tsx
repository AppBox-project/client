import React from "react";
import { Typography } from "@material-ui/core";

const ObjectFieldDisplayOptions: React.FC<{ modelField; objectField }> = ({
  objectField,
  modelField,
}) => {
  return (
    <Typography variant="body1">
      {Array.isArray(objectField) ? objectField.join(", ") : objectField}
    </Typography>
  );
};

export default ObjectFieldDisplayOptions;

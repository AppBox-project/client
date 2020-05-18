import React from "react";
import { Typography } from "@material-ui/core";

const ObjectFieldDisplayInput: React.FC<{ modelField; objectField }> = ({
  objectField,
  modelField,
}) => {
  if (modelField.typeArgs) {
    if (modelField.typeArgs.type === "password") {
      return <>······</>;
    }
  }
  return <Typography variant="body1">{objectField}</Typography>;
};

export default ObjectFieldDisplayInput;

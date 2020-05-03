import React from "react";
import { Checkbox } from "@material-ui/core";

const ObjectFieldDisplayBoolean: React.FC<{ modelField; objectField }> = ({
  objectField,
  modelField,
}) => {
  return <Checkbox disabled checked={objectField} />;
};

export default ObjectFieldDisplayBoolean;

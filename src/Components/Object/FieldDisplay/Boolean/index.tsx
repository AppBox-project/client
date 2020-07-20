import React from "react";
import { Checkbox } from "@material-ui/core";

const ObjectFieldDisplayBoolean: React.FC<{ modelField; objectField }> = ({
  objectField,
  modelField,
}) => {
  return (
    <Checkbox
      style={{ padding: 0 }}
      disabled
      checked={objectField}
      color="primary"
    />
  );
};

export default ObjectFieldDisplayBoolean;

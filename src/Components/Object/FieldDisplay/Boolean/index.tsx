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
      indeterminate={objectField !== true && objectField !== false}
      checked={objectField}
      color="primary"
    />
  );
};

export default ObjectFieldDisplayBoolean;

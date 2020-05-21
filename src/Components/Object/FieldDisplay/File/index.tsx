import React from "react";
import { Typography } from "@material-ui/core";
import styles from "./styles.module.scss";
import { baseUrl } from "../../../../Utils/Utils";

const ObjectFieldDisplayFile: React.FC<{ modelField; objectField }> = ({
  objectField,
  modelField,
}) => {
  return (
    <>
      {objectField ? (
        `${baseUrl}${objectField}`
      ) : (
        <Typography variant="caption">No {modelField.name}</Typography>
      )}
    </>
  );
};

export default ObjectFieldDisplayFile;

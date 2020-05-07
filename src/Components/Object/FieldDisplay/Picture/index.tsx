import React from "react";
import { Typography } from "@material-ui/core";
import styles from "./styles.module.scss";

const ObjectFieldDisplayPicture: React.FC<{ modelField; objectField }> = ({
  objectField,
  modelField,
}) => {
  return (
    <>
      {objectField ? (
        <img src={objectField} />
      ) : (
        <div className={styles.root}>
          <Typography variant="caption">No {modelField.name}</Typography>
        </div>
      )}
    </>
  );
};

export default ObjectFieldDisplayPicture;

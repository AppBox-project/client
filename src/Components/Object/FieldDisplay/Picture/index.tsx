import React from "react";
import { Typography } from "@material-ui/core";
import styles from "./styles.module.scss";
import { baseUrl } from "../../../../Utils/Utils";

const ObjectFieldDisplayPicture: React.FC<{ modelField; objectField }> = ({
  objectField,
  modelField,
}) => {
  return (
    <>
      {objectField ? (
        <div
          className={styles.picturePreview}
          style={{
            backgroundImage: `url(${baseUrl}${objectField})`,
            backgroundSize: "cover",
          }}
        />
      ) : (
        <div className={styles.root}>
          <Typography variant="caption">No {modelField.name}</Typography>
        </div>
      )}
    </>
  );
};

export default ObjectFieldDisplayPicture;

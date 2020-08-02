import React from "react";
import { Typography } from "@material-ui/core";
import styles from "./styles.module.scss";
import { baseUrl } from "../../../../Utils/Utils";

const ObjectFieldDisplayPicture: React.FC<{
  modelField;
  objectField;
  small?: true;
}> = ({ objectField, modelField, small }) => {
  return (
    <>
      {objectField ? (
        <div
          className={small ? styles.picturePreviewSmall : styles.picturePreview}
          style={{
            backgroundImage: `url(${baseUrl}${objectField})`,
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

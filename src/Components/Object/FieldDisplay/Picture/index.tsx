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
          className={`${small ? styles.picturePreviewSmall : styles.picturePreview} colorful-shadow`}
          style={{
            backgroundImage: `url(${baseUrl}${objectField})`,
          }}
        />
      ) : (
          <div
            className={small ? styles.picturePreviewSmall : styles.picturePreview}
            style={{ backgroundColor: "#cc0000" }}
          >
            No {modelField.name}
          </div>
        )}
    </>
  );
};

export default ObjectFieldDisplayPicture;

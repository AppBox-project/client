import React from "react";
import { Typography } from "@material-ui/core";
import { FaExternalLinkAlt } from "react-icons/fa";

const ObjectFieldDisplayInput: React.FC<{ modelField; objectField }> = ({
  objectField,
  modelField,
}) => {
  if (modelField.typeArgs) {
    if (modelField.typeArgs.type === "password") {
      return <>······</>;
    }
  }

  return (
    <Typography variant="body1">
      {typeof objectField === "string" ? (
        modelField?.typeArgs?.type === "email" ? (
          <a
            href={`mailto:${objectField}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaExternalLinkAlt style={{ width: 15, height: 15 }} />{" "}
            {objectField}
          </a>
        ) : modelField?.typeArgs?.type === "url" ? (
          <a href={objectField} target="_blank" rel="noopener noreferrer">
            <FaExternalLinkAlt style={{ width: 15, height: 15 }} />{" "}
            {objectField}
          </a>
        ) : modelField?.typeArgs?.type === "phone" ? (
          <a
            href={`tel:${objectField}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaExternalLinkAlt style={{ width: 15, height: 15 }} />{" "}
            {objectField}
          </a>
        ) : modelField.type === "address" ? (
          <a href={`https://maps.google.com/?q=${objectField}`} target="_blank">
            <FaExternalLinkAlt style={{ width: 15, height: 15 }} />{" "}
            {objectField}
          </a>
        ) : (
          objectField
        )
      ) : (
        JSON.stringify(objectField)
      )}
    </Typography>
  );
};

export default ObjectFieldDisplayInput;

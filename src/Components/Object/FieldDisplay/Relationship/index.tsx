import React, { useState, useEffect } from "react";
import { Skeleton } from "@material-ui/lab";
import uniqid from "uniqid";
import Server from "../../../../Utils/Server";
import { Link } from "react-router-dom";
import { Typography } from "@material-ui/core";

const ObjectFieldDisplayRelationship: React.FC<{ modelField; objectField }> = ({
  objectField,
  modelField,
}) => {
  // Vars
  const [model, setModel] = useState();
  const [object, setObject] = useState();

  // Lifecycle
  useEffect(() => {
    if (!objectField) {
      setModel("empty");
    } else {
      // Get model
      const modelRequestId = uniqid();
      Server.emit("listenForObjectTypes", {
        requestId: modelRequestId,
        filter: { key: modelField.typeArgs.relationshipTo },
      });
      Server.on(`receive-${modelRequestId}`, (response) => {
        setModel(response[0]);
      });

      // Get object
      const objectRequestId = uniqid();
      Server.emit("listenForObjects", {
        requestId: objectRequestId,
        type: modelField.typeArgs.relationshipTo,
        filter: { _id: objectField },
      });

      Server.on(`receive-${objectRequestId}`, (response) => {
        if (response.success) {
          setObject(response.data[0]);
        } else {
          console.log(response);
        }
      });

      return () => {
        Server.emit("unlistenForObjectTypes", { requestId: modelRequestId });
        Server.emit("unlistenForObjects", { requestId: objectRequestId });
      };
    }
  }, [objectField]);

  // UI
  if (model === "empty") return <></>;
  if (!model || !object)
    return <Skeleton variant="rect" width={125} height={10} />;
  return (
    <Link
      to={`/data-explorer/${modelField.typeArgs.relationshipTo}/${objectField}`}
    >
      <Typography
        variant="body1"
        color="primary"
        style={{ fontWeight: "bold" }}
      >
        {object.data[model.primary]}
      </Typography>
    </Link>
  );
};

export default ObjectFieldDisplayRelationship;

import React, { useState, useEffect } from "react";
import { Skeleton } from "@material-ui/lab";
import uniqid from "uniqid";
import Server from "../../../../Utils/Server";
import { Link } from "react-router-dom";
import { Typography } from "@material-ui/core";

const ObjectFieldDisplayRelationship: React.FC<{
  modelField;
  objectField;
  remoteModelCache?;
  onLoadRemoteModel?;
  remoteObjectCache?;
  onLoadRemoteObject?;
}> = ({
  objectField,
  modelField,
  remoteModelCache,
  onLoadRemoteModel,
  remoteObjectCache,
  onLoadRemoteObject,
}) => {
  // Vars
  const [model, setModel] = useState<any>();
  const [object, setObject] = useState<any>();

  // Lifecycle
  useEffect(() => {
    if (!objectField) {
      setModel("empty");
    } else {
      const modelRequestId = uniqid();
      // Get model
      if (remoteModelCache) {
        setModel(remoteModelCache); // Load the cache instead of the fresh model
      } else {
        Server.emit("listenForObjectTypes", {
          requestId: modelRequestId,
          filter: { key: modelField.typeArgs.relationshipTo },
        });
        Server.on(`receive-${modelRequestId}`, (response) => {
          setModel(response[0]);
          if (onLoadRemoteModel) {
            onLoadRemoteModel(response[0]);
            Server.emit("unlistenForObjectTypes", {
              requestId: modelRequestId,
            });
          }
        });
      }
      // Get object
      const objectRequestId = uniqid();
      if (remoteObjectCache) {
        setObject(remoteObjectCache);
      } else {
        Server.emit("listenForObjects", {
          requestId: objectRequestId,
          type: modelField.typeArgs.relationshipTo,
          filter: { _id: objectField },
        });

        Server.on(`receive-${objectRequestId}`, (response) => {
          if (response.success) {
            setObject(response.data[0]);
            if (onLoadRemoteObject) {
              onLoadRemoteObject(response.data[0]);
              Server.emit("unlistenForObjects", {
                requestId: objectRequestId,
              });
            }
          } else {
            console.log(response);
          }
        });
      }

      return () => {
        if (!remoteModelCache) {
          Server.emit("unlistenForObjectTypes", { requestId: modelRequestId });
        }
        if (!remoteObjectCache) {
          Server.emit("unlistenForObjects", { requestId: objectRequestId });
        }
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

import React, { useState, useEffect, Fragment } from "react";
import { Skeleton } from "@material-ui/lab";
import uniqid from "uniqid";
import Server from "../../../../Utils/Server";
import { Chip } from "@material-ui/core";
import { FaTags } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import * as icons from "react-icons/fa";

const ObjectFieldDisplayRelationshipM: React.FC<{
  modelField;
  objectField;
  size?;
  baseUrl?;
}> = ({ objectField, modelField, size, baseUrl }) => {
  // Vars
  const [objects, setObjects] = useState();
  const [model, setModel] = useState();
  const history = useHistory();

  // Lifecycle
  useEffect(() => {
    const requestId = uniqid();
    Server.emit("listenForObjects", {
      requestId,
      type: modelField.typeArgs.relationshipTo,
      filter: { _id: { $in: objectField } },
    });
    Server.on(`receive-${requestId}`, (response) => {
      if (response.success) {
        setObjects(response.data);
      } else {
        console.log(response);
      }
    });

    return () => {
      Server.emit("unlistenForObjects", { requestId });
    };
  }, [objectField]);
  useEffect(() => {
    const requestId = uniqid();
    Server.emit("listenForObjectTypes", {
      requestId,
      filter: { key: modelField.typeArgs.relationshipTo },
    });
    Server.on(`receive-${requestId}`, (response) => {
      setModel(response[0]);
    });
    return () => {
      Server.emit("unlistenForObjectTypes", { requestId });
    };
  }, [modelField]);

  // UI
  return (
    <>
      {objectField ? (
        objects && model ? (
          <>
            {objects.map((object) => {
              const Icon = icons[model.icon ? model.icon : "FaTags"];
              return (
                <Fragment key={object._id}>
                  <Chip
                    size={size}
                    onClick={() => {
                      history.push(
                        baseUrl
                          ? `${baseUrl}/${object._id}`
                          : `/data-explorer/${modelField.typeArgs.relationshipTo}/${object._id}`
                      );
                    }}
                    icon={<Icon style={{ color: "white" }} />}
                    label={object.data[model.primary]}
                    color={!object.data["color"] ? "primary" : "inherit"}
                    style={{
                      color: "white",
                      backgroundColor:
                        object.data["color"] &&
                        `rgba(${object.data["color"].r},${object.data["color"].g},${object.data["color"].b},${object.data["color"].a})`,
                    }}
                  />{" "}
                </Fragment>
              );
            })}
          </>
        ) : (
          <>
            {objectField.map((item, index) => {
              return (
                <Skeleton
                  key={index}
                  variant="text"
                  width={150}
                  height={18}
                  style={{ display: "inline-block" }}
                />
              );
            })}
          </>
        )
      ) : (
        <> </>
      )}
    </>
  );
};

export default ObjectFieldDisplayRelationshipM;

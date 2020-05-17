import React, { useState, useEffect } from "react";
import { Skeleton } from "@material-ui/lab";
import uniqid from "uniqid";
import Server from "../../../../Utils/Server";
import { Chip } from "@material-ui/core";
import { FaTags } from "react-icons/fa";
import { useHistory } from "react-router-dom";

const ObjectFieldDisplayRelationshipM: React.FC<{
  modelField;
  objectField;
}> = ({ objectField, modelField }) => {
  // Vars
  const [objects, setObjects] = useState();
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
  }, [objectField]);
  // UI
  return (
    <>
      {objectField ? (
        objects ? (
          <>
            {objects.map((object) => {
              return (
                <Chip
                  onClick={() => {
                    history.push(
                      `/data-explorer/${modelField.typeArgs.relationshipTo}/${object._id}`
                    );
                  }}
                  icon={<FaTags style={{ color: "white" }} />}
                  label={object.data["name"]}
                  style={{
                    color: "white",
                    backgroundColor:
                      object.data["color"] &&
                      `rgba(${object.data["color"].r},${object.data["color"].g},${object.data["color"].b},${object.data["color"].a})`,
                  }}
                />
              );
            })}
          </>
        ) : (
          <>
            {objectField.map((item, index) => {
              return (
                <Skeleton
                  key={index}
                  variant="circle"
                  width={18}
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

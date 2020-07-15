import React, { useState, useEffect } from "react";
import Loading from "../Components/Loading";
import uniqid from "uniqid";
import Server from "../Utils/Server";
import { get } from "lodash";
import { useHistory } from "react-router-dom";

const LinkHandler: React.FC<{ match: { params: { objectId } } }> = ({
  match: {
    params: { objectId },
  },
}) => {
  // Vars
  const history = useHistory();
  // Lifecycle
  useEffect(() => {
    const idToModelRequestId = uniqid();
    let objectRequestId;
    let modelRequestId;

    Server.emit("getModelFromId", { requestId: idToModelRequestId, objectId });
    Server.on(`receive-${idToModelRequestId}`, (modelType) => {
      // Object
      objectRequestId = uniqid();
      Server.emit("listenForObjects", {
        requestId: objectRequestId,
        type: modelType,
        filter: { _id: objectId },
      });
      Server.on(`receive-${objectRequestId}`, (response) => {
        if (response.success) {
          const object = response.data[0];
          // Object
          modelRequestId = uniqid();
          Server.emit("listenForObjectTypes", {
            requestId: modelRequestId,
            filter: { key: modelType },
          });
          Server.on(`receive-${modelRequestId}`, (response) => {
            const model = response[0];

            // All data loaded, find correct handler
            const handlers = {
              "data-explorer": "/data-explorer/{model:key}/{object:_id}",
              ...model.handlers,
            };
            // Check if the model's main app has a handle registered
            // Else: go for data-explorer
            // Todo: catch the situation when there's another app, rather than the default or DE. Present a picker.
            // Todo 2: allow user preference to override this behaviour
            const app = handlers[model.app] ? model.app : "data-explorer";

            // Replace variables in link format with actual data
            const link = handlers[app].replace(/{(.*?)}/g, (a, v) => {
              const type = v.split(":")[0];
              const field = v.split(":")[1];

              return type === "object"
                ? get(object, field, "error")
                : get(model, field, "error");
            });
            console.log(`Redirecting to ${link}`);
            history.replace(link);
          });
        } else {
          console.log(response);
        }
      });
    });

    return () => {
      if (objectRequestId)
        Server.emit("unlistenForObjects", { requestId: objectRequestId });
      if (modelRequestId)
        Server.emit("unlistenForObjectTypes", { requestId: modelRequestId });
    };
  }, [objectId]);

  // UI
  return <Loading />;
};

export default LinkHandler;

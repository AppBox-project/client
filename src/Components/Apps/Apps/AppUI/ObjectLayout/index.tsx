import React, { useState, useEffect } from "react";
import { ModelType } from "../../../../../Utils/Types";
import Loading from "../../../../Loading";
import Server from "../../../../../Utils/Server";
import uniqid from "uniqid";
import ViewObject from "../../../../Object";

const UIObjectLayout: React.FC<{
  model?: ModelType;
  modelId?: string;
  layoutId: string;
  appId: string;
  objectId?: string;
}> = ({ model, modelId, layoutId, appId, objectId }) => {
  // Vars
  const [appliedModel, setAppliedModel] = useState<ModelType>();

  // Lifecycle
  useEffect(() => {
    let modelRequest;
    if (model) {
      setAppliedModel(model);
    } else {
      const requestId = uniqid();
      modelRequest = Server.emit("listenForObjectTypes", {
        requestId,
        filter: { key: modelId },
      });
      Server.on(`receive-${requestId}`, (response) => {
        if (response.success) {
          setAppliedModel(response.data[0]);
        } else {
          console.log(response);
        }
      });
    }

    return () => {
      if (modelRequest) modelRequest.stop();
    };
  }, [model, modelId]);

  // UI
  if (!appliedModel) return <Loading />;
  return (
    <ViewObject
      objectTypeId={appliedModel.key}
      layoutId={layoutId}
      appId={appId}
      objectId={objectId}
    />
  );
};

export default UIObjectLayout;
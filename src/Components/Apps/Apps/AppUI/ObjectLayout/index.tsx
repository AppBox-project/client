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
  popup?: true;
  defaults?: { [key: string]: string };
}> = ({ model, modelId, layoutId, appId, objectId, popup, defaults }) => {
  // Vars
  const [appliedModel, setAppliedModel] = useState<ModelType>();

  // Lifecycle
  useEffect(() => {
    let requestId;
    if (model) {
      setAppliedModel(model);
    } else {
      requestId = uniqid();
      Server.emit("listenForObjectTypes", {
        requestId,
        filter: { key: modelId },
      });
      Server.on(`receive-${requestId}`, (response) => {
        setAppliedModel(response[0]);
      });
    }

    return () => {
      if (requestId)
        Server.emit("unlistenForObjectTypes", {
          requestId,
        });
    };
  }, [model, modelId]);

  // UI
  if (!appliedModel) return <Loading />;
  return (
    <ViewObject
      popup={popup}
      modelId={appliedModel.key}
      layoutId={layoutId}
      appId={appId}
      defaults={defaults}
      objectId={objectId}
    />
  );
};

export default UIObjectLayout;

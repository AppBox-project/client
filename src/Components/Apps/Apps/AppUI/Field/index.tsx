import React, { useState, useEffect } from "react";
import { AppContextType } from "../../../../../Utils/Types";
import Server from "../../../../../Utils/Server";
import uniqid from "uniqid";
import Loading from "../Loading";
import Field from "../../../../Field";

const AppUiField: React.FC<{
  style?: {};
  modelId: string;
  fieldId: string;
  objectId: string;
  directSave?: true;
  directSaveDelay?: number;
  object?;
  mode: "view" | "edit" | "free";
  onChange?: (value) => void;
}> = ({
  style,
  object,
  modelId,
  fieldId,
  objectId,
  mode,
  directSave,
  directSaveDelay,
}) => {
  // Vars
  const [field, setField] = useState();
  const [loadedObject, setLoadedObject] = useState();

  // Lifecycle
  useEffect(() => {
    const requestId = uniqid();
    Server.emit("listenForObjectTypes", {
      requestId,
      filter: { key: modelId },
    });
    Server.on(`receive-${requestId}`, (response) => {
      setField(response[0].fields[fieldId]);
    });

    if (object) {
      const requestObjectId = uniqid();
      Server.emit("listenForObjects", {
        requestId: requestObjectId,
        filter: { _id: objectId },
        type: "qs-memo",
      });
      Server.on(`receive-${requestObjectId}`, (response) => {
        if (response.success) {
          setLoadedObject(response.data[0]);
        } else {
          console.log(response);
        }
      });
    }
  }, [objectId]);

  // UI
  if (!field || (!object && !loadedObject)) return <Loading />;
  return (
    <div style={style}>
      <Field
        field={field}
        object={object}
        fieldId={fieldId}
        mode={mode}
        directSave={directSave}
        directSaveDelay={directSaveDelay}
      />
    </div>
  );
};

export default AppUiField;

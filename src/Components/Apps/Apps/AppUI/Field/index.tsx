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
  mode: "view" | "edit" | "free";
  onChange?: (value) => void;
}> = ({ style, modelId, fieldId, objectId, mode, directSave }) => {
  // Vars
  const [field, setField] = useState();
  const [object, setObject] = useState();

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

    const requestObjectId = uniqid();
    Server.emit("listenForObjects", {
      requestId: requestObjectId,
      filter: { _id: objectId },
      type: "qs-memo",
    });
    Server.on(`receive-${requestObjectId}`, (response) => {
      if (response.success) {
        setObject(response.data[0]);
      } else {
        console.log(response);
      }
    });
  }, [objectId]);

  // UI
  if (!field || !object) return <Loading />;
  return (
    <div style={style}>
      <Field
        field={field}
        object={object}
        fieldId={fieldId}
        mode={mode}
        directSave={directSave}
      />
    </div>
  );
};

export default AppUiField;

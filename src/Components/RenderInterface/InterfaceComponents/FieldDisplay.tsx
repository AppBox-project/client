import React, { useState, useEffect } from "react";

import { AppContextType, InterfaceType, ModelType } from "../../../Utils/Types";
import FieldDisplay from "../../Object/FieldDisplay";

const RenderInterfaceFieldDisplay: React.FC<{
  layoutItem;
  interfaceObject: InterfaceType;
  vars;
  context: AppContextType;
}> = ({ layoutItem, interfaceObject, vars, context }) => {
  // Vars
  const [model, setModel] = useState<ModelType>();

  // Lifecycle
  useEffect(() => {
    const request = context.getModel(
      vars[layoutItem.fieldDisplay.var].objectId,
      (response) => {
        setModel(response.data);
      }
    );
    return () => {
      request.stop();
    };
  }, [layoutItem?.fieldDisplay?.field]);

  // UI
  if (!model) return <context.UI.Loading />;
  return (
    <FieldDisplay
      object={vars[layoutItem.fieldDisplay.var]}
      modelField={model.fields[layoutItem.fieldDisplay.field]}
      objectField={
        vars[layoutItem.fieldDisplay.var].data[layoutItem.fieldDisplay.field]
      }
    />
  );
};

export default RenderInterfaceFieldDisplay;

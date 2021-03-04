import React, { useState, useEffect } from "react";
import {
  AppContextType,
  InterfaceType,
  ObjectType,
} from "../../../../Utils/Types";
import RenderInterface from "../../../RenderInterface";

const ObjectLayoutItemInterface: React.FC<{
  layoutItem;
  context: AppContextType;
  object: ObjectType;
}> = ({ layoutItem, context, object }) => {
  // Vars
  const [interfaceObject, setInterfaceObject] = useState<InterfaceType>();
  const [premappedVariables, setPremappedvariables] = useState<{}>();

  // Lifecycle
  useEffect(() => {
    const request = context.getObjects(
      "interfaces",
      { _id: layoutItem.interface },
      (response) => {
        const nm = {};
        if (layoutItem?.setVariables?.object)
          nm[layoutItem.setVariables.object] = object;
        if (layoutItem?.setVariables?.id)
          nm[layoutItem.setVariables.id] = object._id;
        setPremappedvariables(nm);
        setInterfaceObject(response.data[0]);
      }
    );
    return () => request.stop();
  }, [layoutItem]);

  // UI
  if (!interfaceObject || !premappedVariables) return <context.UI.Loading />;
  return (
    <RenderInterface
      context={context}
      interfaceObject={interfaceObject}
      premappedVariables={premappedVariables}
    />
  );
};

export default ObjectLayoutItemInterface;

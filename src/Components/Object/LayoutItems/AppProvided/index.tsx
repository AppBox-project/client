import React from "react";
import {
  CustomLayoutElementType,
  AppContextType,
  ObjectType,
} from "../../../../Utils/Types";

const ObjectLayoutItemAppProvided: React.FC<{
  layoutItem;
  customLayoutItems?: { [key: string]: React.FC<CustomLayoutElementType> };
  context: AppContextType;
  mode: "view" | "edit";
  object: ObjectType;
}> = ({ layoutItem, customLayoutItems, context, mode, object }) => {
  // Vars
  const LayoutItem: React.FC<CustomLayoutElementType> =
    (customLayoutItems || {})[layoutItem.identifier] || ElementNotFound;

  // Lifecycle

  // UI
  return (
    <LayoutItem
      context={context}
      mode={mode}
      layoutItem={layoutItem}
      object={object}
      fullObject={object}
    />
  );
};

const ElementNotFound: React.FC = () => <>Custom element wasn't provided.</>;

export default ObjectLayoutItemAppProvided;

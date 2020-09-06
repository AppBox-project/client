import React from "react";
import { Tabs, makeStyles, Tab } from "@material-ui/core";
import Loading from "../../../Loading";
import { useHistory } from "react-router-dom";
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
    />
  );
};

const ElementNotFound: React.FC = () => <>Custom element wasn't provided.</>;

export default ObjectLayoutItemAppProvided;

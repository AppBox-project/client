import React from "react";
import {
  AppContextType,
  ValueListItemType,
  ModelType,
  InterfaceType,
} from "../../../Utils/Types";

const AppSettingsInterfaceActions: React.FC<{
  newInterface: InterfaceType;
  context: AppContextType;
  setNewInterface: (newInterface) => void;
  models: ModelType[];
  modelList: ValueListItemType[];
}> = ({ newInterface, context }) => {
  return <div style={{ margin: 15 }}>Actions</div>;
};

export default AppSettingsInterfaceActions;

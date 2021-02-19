import React from "react";
import { AppContextType } from "../../../Utils/Types";
import { InterfaceType } from "../Types";

const AppSettingsInterfaceUI: React.FC<{
  newInterface: InterfaceType;
  context: AppContextType;
  setNewInterface: (newInterface) => void;
}> = ({ newInterface, context }) => {
  return <div style={{ margin: 15 }}>UI</div>;
};

export default AppSettingsInterfaceUI;

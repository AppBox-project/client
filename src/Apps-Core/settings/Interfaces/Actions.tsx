import React from "react";
import { AppContextType } from "../../../Utils/Types";
import { InterfaceType } from "../Types";

const AppSettingsInterfaceActions: React.FC<{
  newInterface: InterfaceType;
  context: AppContextType;
  setNewInterface: (newInterface) => void;
}> = ({ newInterface, context }) => {
  return <div style={{ margin: 15 }}>Actions</div>;
};

export default AppSettingsInterfaceActions;

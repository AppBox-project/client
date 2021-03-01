import { Button } from "@material-ui/core";
import React from "react";
import { AppContextType, InterfaceType } from "../../../Utils/Types";
import performAction from "../Actions";

const RenderInterfaceButton: React.FC<{
  fullWidth;
  variant;
  label;
  colored?;
  actionId: string;
  interfaceObject: InterfaceType;
  vars;
  setVars;
  context: AppContextType;
}> = ({
  fullWidth,
  variant,
  label,
  colored,
  interfaceObject,
  actionId,
  vars,
  setVars,
  context,
}) => {
  // Vars
  const action = interfaceObject.data.data.actions[actionId];
  // Lifecycle
  // UI
  return (
    <Button
      fullWidth={fullWidth}
      variant={variant}
      color={colored ? "primary" : "default"}
      onClick={() => {
        performAction(action, vars, setVars, interfaceObject, context);
      }}
    >
      {label}
    </Button>
  );
};

export default RenderInterfaceButton;

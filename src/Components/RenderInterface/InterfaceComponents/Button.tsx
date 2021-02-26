import { Button } from "@material-ui/core";
import React from "react";
import { InterfaceType } from "../../../Utils/Types";
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
}> = ({
  fullWidth,
  variant,
  label,
  colored,
  interfaceObject,
  actionId,
  vars,
  setVars,
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
        performAction(action, vars, setVars);
      }}
    >
      {label}
    </Button>
  );
};

export default RenderInterfaceButton;

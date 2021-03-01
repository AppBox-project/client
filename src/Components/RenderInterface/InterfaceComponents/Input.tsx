import { Input } from "@material-ui/core";
import React from "react";
import InputInput from "../../Inputs/Input";

const RenderInterfaceInput: React.FC<{
  layoutItem;
  vars;
  setVars;
}> = ({ layoutItem, vars, setVars }) => {
  // Vars

  // Lifecycle
  // UI
  return (
    <InputInput
      label={layoutItem.label}
      type={layoutItem.inputType}
      value={
        (((vars || {})[layoutItem.attachToVariable.var] || {}).data || {})[
          layoutItem.attachToVariable.field
        ] || ""
      }
      onChange={(newVal) => {
        if (layoutItem.attachToVariable.field) {
          setVars({
            ...vars,
            [layoutItem.attachToVariable.var]: {
              ...vars[layoutItem.attachToVariable.var],
              data: {
                ...(vars[layoutItem.attachToVariable.var] || {}).data,
                [layoutItem.attachToVariable.field]: newVal,
              },
            },
          });
        }
      }}
    />
  );
};

export default RenderInterfaceInput;

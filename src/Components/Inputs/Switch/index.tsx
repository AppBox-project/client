import React, { useState, useEffect } from "react";
import { Switch, FormControlLabel } from "@material-ui/core";

const InputSwitch: React.FC<{
  label?: string;
  value?: boolean;
  onChange?: (value: boolean) => void;
  style?;
}> = ({ label, value, onChange, style }) => {
  // Vars
  const [state, setState] = useState<any>(value ? value : false);

  // Lifecycle
  useEffect(() => {
    setState(value);
  }, [value]);

  // Functions

  // UI

  const SwitchElement = (
    <Switch
      checked={state}
      color="primary"
      onChange={(event) => {
        setState(event.target.checked);
        if (onChange) onChange(event.target.checked);
      }}
    />
  );

  if (label) return <FormControlLabel control={SwitchElement} label={label} />;
  return <>{SwitchElement}</>;
};

export default InputSwitch;

import React, { useState } from "react";
import { Checkbox, FormControlLabel } from "@material-ui/core";

const InputCheckbox: React.FC<{
  label?: string;
  value?: string;
  onChange?: (value: boolean) => void;
  style?;
  disabled?: boolean;
}> = ({ label, value, onChange, style, disabled }) => {
  // Vars
  const [newValue, setNewValue] = useState<any>(value ? value : false);

  // UI
  return label ? (
    <FormControlLabel
      style={style}
      control={
        <Checkbox
          style={{ padding: 0 }}
          color="primary"
          checked={newValue}
          disabled={disabled}
          onChange={(event) => {
            setNewValue(event.target.checked);
            if (onChange) onChange(event.target.checked);
          }}
        />
      }
      label={label}
    />
  ) : (
    <Checkbox
      style={{ ...style, padding: 0 }}
      color="primary"
      checked={newValue}
      disabled={disabled}
      onChange={(event) => {
        setNewValue(event.target.checked);
        if (onChange) onChange(event.target.checked);
      }}
    />
  );
};

export default InputCheckbox;

import React, { useState } from "react";
import { Checkbox } from "@material-ui/core";

const InputCheckbox: React.FC<{
  label?: string;
  value?: string;
  onChange?: (value: boolean) => void;
}> = ({ label, value, onChange }) => {
  // Vars
  const [newValue, setNewValue] = useState(value ? value : false);

  // UI
  return (
    <Checkbox
      style={{ padding: 0 }}
      value={newValue}
      onChange={(event) => {
        setNewValue(event.target.checked);
        if (onChange) onChange(event.target.checked);
      }}
    />
  );
};

export default InputCheckbox;

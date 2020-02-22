import React, { useState, useEffect } from "react";
import { TextField } from "@material-ui/core";

const AppUITextField: React.FC<{
  label: string;
  value: string;
  onChange?: (value: String) => void;
}> = ({ label, value, onChange }) => {
  // Global
  // States & Hooks
  const [newValue, setNewValue] = useState("");
  // Lifecycle
  useEffect(() => {
    setNewValue(value);
  }, [value]);
  // UI
  return (
    <div style={{ margin: 5 }}>
      <TextField
        fullWidth
        margin="normal"
        label={label}
        value={newValue}
        onChange={event => {
          setNewValue(event.target.value);
          if (onChange) onChange(event.target.value);
        }}
      />
    </div>
  );
};

export default AppUITextField;

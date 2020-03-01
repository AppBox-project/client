import React, { useState, useEffect } from "react";
import { TextField } from "@material-ui/core";

const AppUITextField: React.FC<{
  label: string;
  value: string;
  onChange?: (value: string) => void;
  multiline?: boolean;
}> = ({ label, value, onChange, multiline }) => {
  // Global
  // States & Hooks
  const [newValue, setNewValue] = useState("");
  // Lifecycle
  useEffect(() => {
    setNewValue(value);
  }, [value]);
  // UI
  return (
    <div className="input-container">
      <div
        className="input-container-sub"
        style={{ width: "100%", paddingRight: 5 }}
      >
        <TextField
          fullWidth
          margin="normal"
          label={label}
          value={newValue}
          multiline={multiline}
          onChange={event => {
            setNewValue(event.target.value);
            if (onChange) onChange(event.target.value);
          }}
        />
      </div>
    </div>
  );
};

export default AppUITextField;

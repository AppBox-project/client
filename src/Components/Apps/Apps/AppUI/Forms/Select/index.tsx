import React, { useState, useEffect } from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";

const AppUISelect: React.FC<{
  label: string;
  value?: string;
  options: { value: string; label: string }[];
  onChange?: (value) => void;
  style?;
}> = ({ label, value, onChange, options, style }) => {
  // Global
  // States & Hooks
  const [newValue, setNewValue] = useState<any>("");
  // Lifecycle
  useEffect(() => {
    setNewValue(value);
  }, [value]);

  // UI
  return (
    <FormControl fullWidth style={style}>
      <InputLabel>{label}</InputLabel>
      <Select
        fullWidth
        value={newValue}
        onChange={(event) => {
          //@ts-ignore
          setNewValue(event.target.value);
          if (onChange) onChange(event.target.value);
        }}
      >
        {options.map((option) => {
          return (
            <MenuItem value={option.value} key={option.value}>
              {option.label}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default AppUISelect;

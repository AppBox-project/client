import React, { useState, useEffect } from "react";
import {
  Grid,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@material-ui/core";

const AppUISelect: React.FC<{
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange?: (value) => void;
}> = ({ label, value, onChange, options }) => {
  // Global
  // States & Hooks
  const [newValue, setNewValue] = useState("");
  // Lifecycle
  useEffect(() => {
    setNewValue(value);
  }, [value]);

  // UI
  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select
        fullWidth
        value={newValue}
        onChange={event => {
          //@ts-ignore
          setNewValue(event.target.value);
          onChange(event.target.value);
        }}
      >
        {options.map(option => {
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

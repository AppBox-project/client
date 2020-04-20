import React, { useState, useEffect } from "react";
import { TextField, InputBase } from "@material-ui/core";
import styles from "./styles.module.scss";

const AppUITextField: React.FC<{
  label: string;
  value: string;
  onChange?: (value: string) => void;
  multiline?: boolean;
  style?: {};
  autoFocus?: boolean;
}> = ({ label, value, onChange, multiline, style, autoFocus }) => {
  // Global
  // States & Hooks
  const [newValue, setNewValue] = useState("");
  // Lifecycle
  useEffect(() => {
    setNewValue(value);
  }, [value]);
  // UI
  return (
    <input
      type="text"
      className={styles.input}
      placeholder={label}
      value={newValue}
      onChange={(event) => {
        setNewValue(event.target.value);
        onChange(event.target.value);
      }}
      style={style}
      autoFocus={autoFocus}
    />
  );
};

export default AppUITextField;

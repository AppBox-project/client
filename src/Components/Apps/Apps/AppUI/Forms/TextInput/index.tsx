import React, { useState, useEffect } from "react";
import styles from "./styles.module.scss";
import { Typography } from "@material-ui/core";

const AppUITextField: React.FC<{
  label: string;
  value: string;
  onChange?: (value: string) => void;
  multiline?: boolean;
  style?: {};
  autoFocus?: boolean;
  type?: "text" | "number";
}> = ({ label, value, onChange, multiline, style, autoFocus, type }) => {
  // Global
  // States & Hooks
  const [newValue, setNewValue] = useState<any>("");
  // Lifecycle
  useEffect(() => {
    setNewValue(value);
  }, [value]);
  // UI
  return (
    <>
      {label && <Typography variant="caption">{label}</Typography>}
      <input
        type={type ? type : "text"}
        className={styles.input}
        placeholder={label}
        value={newValue}
        onChange={(event) => {
          setNewValue(event.target.value);
          if (onChange) onChange(event.target.value);
        }}
        style={style}
        autoFocus={autoFocus}
      />
    </>
  );
};

export default AppUITextField;

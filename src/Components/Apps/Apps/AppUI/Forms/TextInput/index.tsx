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
  noLabel?: true | boolean;
  onEnter?: (value: string) => void;
  onEscape?: (value: string) => void;
  onKeyPress?: (value: string) => void;
}> = ({
  label,
  value,
  onChange,
  multiline,
  style,
  autoFocus,
  type,
  noLabel,
  onEnter,
  onEscape,
  onKeyPress,
}) => {
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
      {label && !noLabel && <Typography variant="caption">{label}</Typography>}
      <input
        type={type ? type : "text"}
        className={styles.input}
        placeholder={label}
        value={newValue}
        onChange={(event) => {
          setNewValue(event.target.value);
          if (onChange) onChange(event.target.value);
        }}
        onKeyDown={(e) => {
          if (onKeyPress) onKeyPress(newValue);
          if (e.key === "Enter") {
            if (onEnter) onEnter(newValue);
          }
          if (e.key === "Escape") {
            if (onEscape) onEscape(newValue);
          }
        }}
        style={style}
        autoFocus={autoFocus ? true : false}
      />
    </>
  );
};

export default AppUITextField;

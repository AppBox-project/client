import React, { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import InputInput from "../../../../../Inputs/Input";

const AppUITextField: React.FC<{
  label: string;
  value: string;
  onChange?: (value: string | number) => void;
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
      <InputInput
        type={type || "text"}
        placeholder={label}
        value={newValue}
        onChange={(value) => {
          setNewValue(value);
          if (onChange) onChange(value);
        }}
        onEnter={onEnter}
        onEscape={onEscape}
        style={style}
        autoFocus={autoFocus ? true : false}
      />
    </>
  );
};

export default AppUITextField;

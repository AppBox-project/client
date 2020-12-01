import React, { useState, useEffect } from "react";
import styles from "./styles.module.scss";
import { ChromePicker } from "react-color";

const InputColor: React.FC<{
  placeholder?: string;
  label?: string;
  value?:
    | { r: number; g: number; b: number }
    | string
    | { h: number; s: number; l: number };
  onChange?: (value: { r: number; g: number; b: number }) => void;
}> = ({ placeholder, label, value, onChange }) => {
  // Vars
  const [newValue, setNewValue] = useState<any>("");

  // Lifecycle
  useEffect(() => {
    setNewValue(value);
  }, [value]);

  // UI

  return (
    <ChromePicker
      color={newValue}
      onChange={(color) => {
        setNewValue(color.hex);
      }}
      onChangeComplete={(color) => {
        if (onChange) onChange(color.rgb);
      }}
    />
  );
};

export default InputColor;

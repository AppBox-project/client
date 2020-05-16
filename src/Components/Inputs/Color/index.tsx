import React, { useState, useEffect } from "react";
import styles from "./styles.module.scss";
import { ChromePicker } from "react-color";
const InputColor: React.FC<{
  placeholder?: string;
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
}> = ({ placeholder, label, value, onChange }) => {
  // Vars
  const [newValue, setNewValue] = useState("");

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

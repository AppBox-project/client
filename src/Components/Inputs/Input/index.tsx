import React, { useState, useEffect } from "react";
import styles from "./styles.module.scss";

const InputInput: React.FC<{
  placeholder?: string;
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?;
  style?;
  autoFocus?;
}> = ({ placeholder, label, value, onChange, type, style, autoFocus }) => {
  // Vars
  const [newValue, setNewValue] = useState<any>("");

  // Lifecycle
  useEffect(() => {
    setNewValue(value);
  }, [value]);

  // UI
  if (label)
    return (
      <label style={{ width: "100%" }}>
        {label}
        <input
          autoFocus={autoFocus}
          style={style}
          type={type ? type : "text"}
          className={styles.input}
          placeholder={placeholder}
          value={newValue}
          onChange={(event) => {
            setNewValue(event.target.value);
            if (onChange) onChange(event.target.value);
          }}
        />
      </label>
    );
  return (
    <input
      style={style}
      className={styles.input}
      type={type ? type : "text"}
      placeholder={placeholder}
      value={newValue}
      autoFocus={autoFocus}
      onChange={(event) => {
        setNewValue(event.target.value);
        if (onChange) onChange(event.target.value);
      }}
    />
  );
};

export default InputInput;

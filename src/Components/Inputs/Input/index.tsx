import React, { useState, useEffect } from "react";
import styles from "./styles.module.scss";

const InputInput: React.FC<{
  placeholder?: string;
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?;
}> = ({ placeholder, label, value, onChange, type }) => {
  // Vars
  const [newValue, setNewValue] = useState("");

  // Lifecycle
  useEffect(() => {
    setNewValue(value);
  }, [value]);

  // UI
  if (label)
    return (
      <label>
        {label}
        <input
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
      className={styles.input}
      type={type ? type : "text"}
      placeholder={placeholder}
      value={newValue}
      onChange={(event) => {
        setNewValue(event.target.value);
        if (onChange) onChange(event.target.value);
      }}
    />
  );
};

export default InputInput;

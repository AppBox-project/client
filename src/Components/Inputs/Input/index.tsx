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
  readOnly?: boolean;
  onEnter?: (value: string) => void;
  onEscape?: (value: string) => void;
  onKeyPress?: (value: string) => void;
}> = ({
  placeholder,
  label,
  value,
  onChange,
  type,
  style,
  autoFocus,
  readOnly,
  onEnter,
  onEscape,
  onKeyPress,
}) => {
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
          disabled={readOnly || false}
          value={newValue}
          onChange={(event) => {
            setNewValue(event.target.value);
            if (onChange && !readOnly) onChange(event.target.value);
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
      disabled={readOnly || false}
      autoFocus={autoFocus}
      onChange={(event) => {
        setNewValue(event.target.value);
        if (onChange && !readOnly) onChange(event.target.value);
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
    />
  );
};

export default InputInput;

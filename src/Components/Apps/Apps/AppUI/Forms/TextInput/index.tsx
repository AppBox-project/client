import React, { useState, useEffect } from "react";
import { TextField, InputBase } from "@material-ui/core";
import styles from "./styles.module.scss";

const AppUITextField: React.FC<{
  label: string;
  value: string;
  onChange?: (value: string) => void;
  multiline?: boolean;
}> = ({ label, value, onChange, multiline }) => {
  // Global
  // States & Hooks
  const [newValue, setNewValue] = useState("");
  // Lifecycle
  useEffect(() => {
    setNewValue(value);
  }, [value]);
  // UI
  return <input type="text" className={styles.input} placeholder={label} />;
};

export default AppUITextField;

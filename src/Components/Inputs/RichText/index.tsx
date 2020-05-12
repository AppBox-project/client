import React, { useState, useEffect } from "react";

const InputRichText: React.FC<{
  placeholder?: string;
  label?: string;
  value?: string;
  mode?: "classic" | "balloon";
  onChange?: (value: string) => void;
}> = ({ placeholder, label, value, onChange }) => {
  // Vars
  const [newValue, setNewValue] = useState("");

  // Lifecycle
  useEffect(() => {
    setNewValue(value);
  }, [value]);

  // UI
  return <>This broke things</>;
};

export default InputRichText;

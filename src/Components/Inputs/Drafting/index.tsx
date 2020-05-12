import React, { useState, useEffect } from "react";

const InputDrafting: React.FC<{
  placeholder?: string;
  mode?: "normal" | "inline";
  onChange: (value: string) => void;
  value?: string;
}> = ({ placeholder, mode, onChange, value }) => {
  // Vars
  const [newValue, setNewValue] = useState(value);

  // Lifecycle
  useEffect(() => {
    setNewValue(value);
  }, [value]);

  // UI
  return <>quill is gone</>;
};

export default InputDrafting;

import React, { useState, useEffect } from "react";
import Select from "react-select";

const InputSelect: React.FC<{
  label: string;
  options: { value; label: string }[];
  value?;
  isLoading?: boolean;
  onChange?: (value) => void;
}> = ({ label, options, value, isLoading, onChange }) => {
  // Vars
  const [newValue, setNewValue] = useState<any>();

  // Lifecycle
  useEffect(() => {
    setNewValue(value);
  }, [value]);

  // UI
  return (
    <Select
      options={options}
      value={newValue}
      isLoading={isLoading}
      onChange={(chosen) => {
        setNewValue(chosen);
        if (onChange) onChange(chosen);
      }}
    />
  );
};

export default InputSelect;

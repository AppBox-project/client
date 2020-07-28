import React, { useState, useEffect } from "react";
import Select from "react-select";
import { find } from "lodash";

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
    if ((options || []).includes(value)) {
      // We were sent an entire object
      setNewValue(value);
    } else {
      // We were only sent a value, map it!
      setNewValue(find(options, (o) => o.value === value));
    }
  }, [value, options]);

  // UI
  return (
    <Select
      isClearable
      options={options}
      value={newValue}
      isLoading={isLoading}
      name={label}
      onChange={(chosen) => {
        setNewValue(chosen);
        if (onChange) onChange(chosen);
      }}
    />
  );
};

export default InputSelect;

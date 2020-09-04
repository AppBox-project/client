import React, { useState, useEffect } from "react";
import Select from "react-select";
import { find } from "lodash";

const InputSelect: React.FC<{
  label: string;
  options: { value; label: string }[];
  value?;
  isLoading?: boolean;
  onChange?: (value) => void;
  multiple?: true | boolean;
}> = ({ label, options, value, isLoading, onChange, multiple }) => {
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
      isMulti={multiple}
      placeholder={label}
      isLoading={isLoading}
      name={label}
      onChange={(chosen) => {
        setNewValue(chosen);
        if (onChange) onChange(chosen);
      }}
      styles={{
        container: (styles) => ({
          ...styles,
          zIndex: 101,
          position: "relative",
        }),
        control: (styles) => ({
          ...styles,
          position: "relative",
          zIndex: 101,
        }),
      }}
    />
  );
};

export default InputSelect;

import React, { useState, useEffect } from "react";
import { useGlobal } from "reactn";
import Select from "react-select";
import { find } from "lodash";
import { CSSProperties } from "@material-ui/core/styles/withStyles";

const InputSelect: React.FC<{
  label: string;
  options: { value; label: string }[];
  value?;
  isLoading?: boolean;
  onChange?: (value) => void;
  multiple?: true | boolean;
  style?: CSSProperties;
}> = ({ label, options, value, isLoading, onChange, multiple, style }) => {
  // Vars
  const [newValue, setNewValue] = useState<string | any[]>();
  const [app] = useGlobal<any>("app");

  // Lifecycle
  useEffect(() => {
    if ((options || []).includes(value)) {
      // We were sent an entire object
      setNewValue(value);
    } else {
      // We were only sent a value, map it!
      if (Array.isArray(value)) {
        // Multiple
        const nv = [];
        value.map((v) => nv.push(find(options, (o) => o.value === v)));
        console.log(nv);
        setNewValue(nv);
      } else {
        // Single
        setNewValue(find(options, (o) => o.value === value));
      }
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
        if (onChange) onChange(chosen?.value);
      }}
      styles={{
        menu: (styles) => ({
          ...styles,
          ...style,
          zIndex: 500,
        }),
        control: (styles) => ({
          ...styles,
          ...style,
          position: "relative",
          zIndex: 100,
        }),
        container: (styles) => ({
          ...styles,
          zIndex: 100,
          margin: "10px 0",
        }),

        option: (styles, { data, isDisabled, isFocused, isSelected }) => {
          return {
            ...styles,
            zIndex: 500,

            backgroundColor: isSelected
              ? `rgba(${app.data.color.r},${app.data.color.g},${app.data.color.b},1)`
              : isFocused &&
                `rgba(${app.data.color.r},${app.data.color.g},${app.data.color.b},0.4)`,
          };
        },
      }}
    />
  );
};

export default InputSelect;

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
  const [gTheme] = useGlobal<any>("theme");

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
        if (onChange) {
          if (Array.isArray(chosen)) {
            const val = [];
            chosen.map((v) => val.push(v.value));
            onChange(val);
          } else {
            onChange(chosen?.value);
          }
        }
      }}
      menuPortalTarget={document.body}
      styles={{
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        menu: (styles) => ({
          ...styles,
          ...style,
          backgroundColor: gTheme.palette.type === "dark" ? "#323232" : "white",
          zIndex: 500,
        }),
        singleValue: (styles) => ({
          ...styles,
          ...style,
          color: gTheme.palette.type === "dark" ? "white" : "black",
        }),
        control: (styles) => ({
          ...styles,
          ...style,
          backgroundColor: gTheme.palette.type === "dark" ? "#323232" : "white",
          color: gTheme.palette.type === "dark" && "white",
          border: "1px solid rgba(100, 100, 100, 1)",
          position: "relative",
          transition: "all 0.3s",
          zIndex: 100,
        }),
        container: (styles) => ({
          ...styles,
          color: gTheme.palette.type === "dark" && "white",
        }),
        input: (styles) => ({
          ...styles,
          zIndex: 100,
          margin: "10px 0",
        }),
        valueContainer: (styles) => ({
          ...styles,
          zIndex: 100,
          color: gTheme.palette.type === "dark" && "white",
        }),
        multiValue: (styles) => ({
          ...styles,
          ...(gTheme.palette.type === "dark"
            ? { backgroundColor: "#454545" }
            : {}),
        }),
        multiValueLabel: (styles) => ({
          ...styles,
          ...(gTheme.palette.type === "dark" ? { color: "whitesmoke" } : {}),
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

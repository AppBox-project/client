import React, { useState, useEffect, useRef } from "react";
import { useGlobal } from "reactn";
import AsyncSelect from "react-select/async";
import axios from "axios";
import { rejects } from "assert";
var debounce = require("debounce-promise");

const InputAddress: React.FC<{
  placeholder?: string;
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?;
  style?;
}> = ({ placeholder, label, value, onChange, type, style }) => {
  // Vars
  const [newValue, setNewValue] = useState<any>("");
  const [isLoading, setIsLoading] = useState<any>(false);
  const [gTheme] = useGlobal<any>("theme");
  const [app] = useGlobal<any>("app");

  const debouncedLoadOptions = useRef(
    debounce((query) => {
      return new Promise(async (resolve, reject) => {
        if (query) {
          const results = [];
          await (
            await await axios.get(
              `https://nominatim.openstreetmap.org/search/${query}?format=json`
            )
          ).data.map((item) => {
            results.push({ label: item.display_name });
          });
          setIsLoading(false);

          resolve(results);
        } else {
          reject();
        }
      });
    }, 1000)
  ).current;

  // Lifecycle
  useEffect(() => {
    setNewValue(value);
  }, [value]);

  // UI
  return (
    <AsyncSelect
      value={{ label: newValue }}
      cacheOptions
      defaultOptions
      isLoading={isLoading}
      loadOptions={async (inputValue) => {
        if (inputValue) setIsLoading(true);
        return await debouncedLoadOptions(inputValue ? inputValue : newValue);
      }}
      onChange={(option) => {
        //@ts-ignore
        if (onChange) onChange(option.label);
      }}
      isClearable
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

export default InputAddress;

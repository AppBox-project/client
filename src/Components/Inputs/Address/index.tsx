import React, { useState, useEffect, useRef } from "react";
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
  const [newValue, setNewValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    />
  );
};

export default InputAddress;

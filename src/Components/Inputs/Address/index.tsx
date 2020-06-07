import React, { useState, useEffect, useRef } from "react";
import AsyncSelect from "react-select/async";
import axios from "axios";
import { debounce } from "lodash";

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
  const search = async (query) => {
    return await axios.get(
      `https://nominatim.openstreetmap.org/search/${query}?format=json`
    );
  };

  const debouncedLoadOptions = useRef(
    debounce((query) => {
      return new Promise(async (resolve) => {
        console.log(`Search ${query}`);
        const results = [];
        await (await search(query)).data.map((item) => {
          results.push({ label: item.display_name });
        });
        resolve(results);
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
      loadOptions={async (inputValue) =>
        debouncedLoadOptions(inputValue ? inputValue : newValue)
      }
      onChange={(option) => {
        //@ts-ignore
        if (onChange) onChange(option.label);
      }}
      isClearable
    />
  );
};

export default InputAddress;

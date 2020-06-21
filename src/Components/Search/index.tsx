import React, { useState, useEffect, useRef } from "react";
import AsyncSelect from "react-select/async";
import uniqid from "uniqid";
import Server from "../../Utils/Server";

var debounce = require("debounce-promise");

const Search: React.FC<{}> = ({}) => {
  // Vars
  const [newValue, setNewValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const debouncedLoadOptions = useRef(
    debounce((query) => {
      return new Promise(async (resolve, reject) => {
        if (query) {
          const requestId = uniqid();
          Server.emit("search", { query, requestId });
          Server.on(`receive-${requestId}`, (response) => {
            setIsLoading(false);
            resolve(response);
          });
        } else {
          reject();
        }
      });
    }, 250)
  ).current;

  // Lifecycle

  // UI
  return (
    <div style={{ flex: 1, margin: "0 35px" }}>
      <AsyncSelect
        isLoading={isLoading}
        loadOptions={async (inputValue) => {
          if (inputValue) setIsLoading(true);
          return await debouncedLoadOptions(inputValue);
        }}
        isClearable
        placeholder="Search everything..."
        noOptionsMessage={(msg) =>
          msg.inputValue
            ? `${msg.inputValue} not found.`
            : "Start typing to search.."
        }
        styles={{
          control: (styles) => ({
            ...styles,
            backgroundColor: "rgba(255,255,255,0.1)",
            border: 0,
          }),
          placeholder: (styles, { isFocused }) => {
            return {
              ...styles,
              color: `rgba(255,255,255,${isFocused ? 0.85 : 0.4})`,
            };
          },
        }}
      />
    </div>
  );
};

export default Search;

import React, { useState, useEffect } from "react";
import InputSelect from "../Select";
import uniqid from "uniqid";
import Server from "../../../Utils/Server";

const InputRelationShip: React.FC<{
  label: string;
  objectType: string;
  onChange?: (value) => void;
  value?: string;
}> = ({ label, objectType, onChange, value }) => {
  // Vars
  const [options, setOptions] = useState<any>();
  const [newValue, setNewValue] = useState();

  // Lifecycle
  useEffect(() => {
    const modelRequest = uniqid();
    Server.emit("listenForObjectTypes", {
      requestId: modelRequest,
      filter: { key: objectType },
    });
    Server.on(`receive-${modelRequest}`, (response) => {
      const model = response[0];
      const optionsRequest = uniqid();
      Server.emit("listenForObjects", {
        requestId: optionsRequest,
        type: objectType,
        filter: {},
      });
      Server.on(`receive-${optionsRequest}`, (response) => {
        if (response.success) {
          const newOptions = [];
          response.data.map((item) => {
            if (item._id === value)
              setNewValue({
                label: item.data[model.primary],
                value: item._id,
              });
            newOptions.push({
              label: item.data[model.primary],
              value: item._id,
            });
          });
          setOptions(newOptions);
        } else {
          console.log(response);
        }
      });
    });
  }, [objectType]);

  // UI
  return (
    <InputSelect
      label={label}
      options={options}
      isLoading={options === undefined}
      value={newValue}
      onChange={(selected) => {
        setNewValue(selected.value);
        if (onChange) onChange(selected.value);
      }}
    />
  );
};

export default InputRelationShip;

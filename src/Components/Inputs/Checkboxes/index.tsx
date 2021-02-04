import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
const uniqid = require("uniqid");

const InputCheckboxes: React.FC<{
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  type?: "radio" | "checkbox";
  options: { value; label: string }[];
}> = ({ label, value, onChange, readOnly, type, options }) => {
  // Vars
  const [newValue, setNewValue] = useState<any>("");

  // Lifecycle
  useEffect(() => {
    setNewValue(value);
  }, [value]);

  // UI
  return (
    <div>
      {type === "checkbox" ? (
        "Todo: checkbox"
      ) : (
        <FormControl component="fieldset">
          {label && (
            <Typography variant="body2">
              <FormLabel component="legend">{label}</FormLabel>
            </Typography>
          )}
          <RadioGroup
            name={uniqid()}
            value={newValue}
            onChange={(event) => {
              setNewValue(event.target.checked);
              if (onChange && !readOnly) onChange(event.target.value);
            }}
          >
            {options.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio color="primary" />}
                label={option.label}
              />
            ))}
          </RadioGroup>
        </FormControl>
      )}
    </div>
  );
};

export default InputCheckboxes;

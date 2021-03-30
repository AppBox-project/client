import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@material-ui/core";
import React from "react";
import { remove } from "lodash";
const uniqid = require("uniqid");

const InputCheckboxes: React.FC<{
  label?: string;
  value?: string | string[] | boolean;
  onChange?: (value: string | string[] | boolean) => void;
  readOnly?: boolean;
  type?: "radio" | "checkbox";
  options: { value: string; label: string }[];
}> = ({ label, value, onChange, readOnly, type, options }) => {
  // Vars

  // Lifecycle

  // UI

  return (
    <div>
      {type === "checkbox" ? (
        <FormControl component="fieldset">
          <FormLabel component="legend">{label}</FormLabel>
          <FormGroup>
            {options.map((option) => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={(typeof value === "object" ? value : []).includes(
                      option.value
                    )}
                    onChange={(e) => {
                      let array = value as string[];
                      if (e.target.checked) {
                        array.push(option.value);
                        onChange(array);
                      } else {
                        remove(array, (o) => o === option.value);
                        onChange(array);
                      }
                    }}
                    name={option.label}
                  />
                }
                label={option.label}
              />
            ))}
          </FormGroup>
          <FormHelperText>Choose one or more options</FormHelperText>
        </FormControl>
      ) : (
        <FormControl component="fieldset">
          {label && (
            <Typography variant="body2">
              <FormLabel component="legend">{label}</FormLabel>
            </Typography>
          )}
          <RadioGroup
            name={uniqid()}
            value={value}
            onChange={(event) => {
              onChange(event.target.checked);
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

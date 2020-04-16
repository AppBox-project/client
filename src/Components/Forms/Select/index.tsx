import React, { useState } from "react";
import { Select, MenuItem, FormControl, InputLabel } from "@material-ui/core";

const SelectUI: React.FC<{
  label: string;
  options: { value; label: string }[];
}> = ({ label, options }) => {
  // Vars
  const [value, setValue] = useState("1");
  // Lifecycle
  // UI
  return (
    <FormControl>
      <InputLabel id="label">{label}</InputLabel>
      <Select
        labelId="label"
        value={value}
        onChange={(event) => {
          //@ts-ignore
          setValue(event.target.value);
        }}
      >
        {options.map((option) => {
          <MenuItem value={option.value}>{option.label}</MenuItem>;
        })}
      </Select>
    </FormControl>
  );
};

export default Select;

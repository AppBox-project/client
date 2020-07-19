import React, { useState } from "react";
import { DatePicker } from "@material-ui/pickers";

const InputDate: React.FC<{
  placeholder?: string;
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
}> = ({ placeholder, label, value, onChange }) => {
  const [newValue, setNewValue] = useState(new Date());

  return (
    <DatePicker
      disableFuture
      openTo="year"
      format="dd/MM/yyyy"
      label="Date of birth"
      views={["year", "month", "date"]}
      value={newValue}
      onChange={(value) => {
        console.log(value);
      }}
    />
  );
};

export default InputDate;

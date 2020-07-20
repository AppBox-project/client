import React, { useState } from "react";
import { DatePicker } from "@material-ui/pickers";

const InputDate: React.FC<{
  placeholder?: string;
  label?: string;
  value?: string;
  onChange?: (value: Date) => void;
  disableFuture?: boolean;
  disablePast?: boolean;
}> = ({ placeholder, label, value, onChange, disableFuture, disablePast }) => {
  const [selectedDate, setSelectedDate] = useState(value || new Date());

  return (
    <DatePicker
      label={label}
      value={selectedDate}
      onChange={(value) => {
        setSelectedDate(value);
        if (onChange) onChange(value);
      }}
      animateYearScrolling
      fullWidth
      autoOk
      disableFuture={disableFuture}
      disablePast={disablePast}
    />
  );
};

export default InputDate;

import React, { useState } from "react";
import { DatePicker, DateTimePicker, TimePicker } from "@material-ui/pickers";

const InputDate: React.FC<{
  placeholder?: string;
  label?: string;
  value?: Date;
  onChange?: (value: Date) => void;
  disableFuture?: boolean;
  disablePast?: boolean;
  type?: "date" | "time" | "datetime";
}> = ({
  placeholder,
  label,
  value,
  onChange,
  disableFuture,
  disablePast,
  type,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(value);

  switch (type) {
    case "time":
      return (
        <TimePicker
          label={label}
          value={selectedDate}
          onChange={(value) => {
            setSelectedDate(value);
            if (onChange) onChange(value);
          }}
          fullWidth
          autoOk
        />
      );

    case "datetime":
      return (
        <DateTimePicker
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

    default:
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
  }
};

export default InputDate;

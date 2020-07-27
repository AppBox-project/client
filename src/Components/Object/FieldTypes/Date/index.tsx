import React from "react";
import InputDate from "../../../Inputs/Date";

const FieldTypeDate: React.FC<{ onChange; modelField; objectField }> = ({
  onChange,
  modelField,
  objectField,
}) => {
  return (
    <InputDate
      onChange={(value) => {
        onChange(value);
      }}
      placeholder={modelField.name}
      value={objectField}
      type={modelField?.typeArgs?.type}
    />
  );
};

export default FieldTypeDate;

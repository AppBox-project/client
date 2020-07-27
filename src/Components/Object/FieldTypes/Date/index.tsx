import React from "react";
import InputDate from "../../../Inputs/Date";

const FieldTypeDate: React.FC<{ onChange; modelField; objectField }> = ({
  onChange,
  modelField,
  objectField,
}) => {
  console.log(modelField);

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

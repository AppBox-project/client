import React from "react";
import InputDate from "../../../Inputs/Date";
import InputInput from "../../../Inputs/Input";

const FieldTypeData: React.FC<{ onChange; modelField; objectField }> = ({
  onChange,
  modelField,
  objectField,
}) => {
  return (
    <InputInput
      label={modelField.name}
      value={
        typeof objectField === "string"
          ? objectField
          : JSON.stringify(objectField)
      }
      onChange={(val: string) => {
        onChange(JSON.parse(val || "{}"));
      }}
    />
  );
};

export default FieldTypeData;

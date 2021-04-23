import React, { useState, useEffect } from "react";
import { ModelFieldType } from "../../../../Utils/Types";
import Loading from "../../../Loading";
import InputRichText from "../../../Inputs/RichText";

const FieldTypeRichText: React.FC<{
  mode: "view" | "edit" | "free";
  field: ModelFieldType;
  object: any;
  fieldKey: string;
  setMode?: (mode: "view" | "edit" | "free") => void;
  onChange: (value: any) => void;
}> = ({ mode, field, object, fieldKey, setMode, onChange }) => {
  // Hooks
  const [newValue, setNewValue] = useState<any>();
  // Lifecycle
  useEffect(() => {
    setNewValue(
      object ? (object.data[fieldKey] ? object.data[fieldKey] : "") : ""
    );
  }, [fieldKey, object]);

  // Todo: changing value causes it to save (it's a change. Prevent this)

  // UI
  if (newValue === undefined) return <Loading />;
  return (
    <InputRichText
      placeholder={field.name}
      value={newValue}
      onChange={(value) => {
        onChange(value);
      }}
      variant={field.typeArgs?.variant}
      toolbar={field?.typeArgs?.toolbar}
    />
  );
};

export default FieldTypeRichText;

import React, { useState, useEffect } from "react";
import { TextField, Grid, Typography } from "@material-ui/core";
import { ModelFieldType } from "../../../../Utils/Types";
import Loading from "../../../Loading";
import InputDrafting from "../../../Inputs/Drafting";
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
  const [newValue, setNewValue] = useState();
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
    />
  );
};

export default FieldTypeRichText;

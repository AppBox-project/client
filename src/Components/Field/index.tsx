import React from "react";
import { ModelFieldType, TypeType } from "../../Utils/Types";
import FieldTypeInput from "../Object/FieldTypes/Input";
import FieldTypeBoolean from "../Object/FieldTypes/Boolean";
import FieldTypeRelationship from "../Object/FieldTypes/Relationship";
import FieldTypeRichText from "../Object/FieldTypes/RichText";
import FieldTypeFormula from "../Object/FieldTypes/Formula";

const Field: React.FC<{
  field: ModelFieldType;
  mode?: "view" | "edit";
  object: TypeType;
  fieldId: string;
  setMode?: (mode: "view" | "edit") => void;
  onChange;
}> = ({ field, mode, object, fieldId, setMode, onChange }) => {
  return (
    <>
      {field.type === "input" && (
        <FieldTypeInput
          mode={mode ? mode : "edit"}
          field={field}
          object={object}
          fieldKey={fieldId}
          setMode={setMode}
          onChange={onChange}
        />
      )}
      {field.type === "boolean" && (
        <FieldTypeBoolean
          mode={mode}
          field={field}
          object={object}
          fieldKey={fieldId}
          setMode={setMode}
          onChange={onChange}
        />
      )}
      {field.type === "relationship" && (
        <FieldTypeRelationship
          mode={mode}
          field={field}
          object={object}
          fieldKey={fieldId}
          setMode={setMode}
          onChange={onChange}
        />
      )}
      {field.type === "richtext" && (
        <FieldTypeRichText
          mode={mode}
          field={field}
          object={object}
          fieldKey={fieldId}
          setMode={setMode}
          onChange={onChange}
        />
      )}
      {field.type === "formula" && (
        <FieldTypeFormula
          mode={mode}
          field={field}
          object={object}
          fieldKey={fieldId}
          setMode={setMode}
          onChange={onChange}
        />
      )}
    </>
  );
};

export default Field;

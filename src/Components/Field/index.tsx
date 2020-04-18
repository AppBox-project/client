import React, { useState } from "react";
import { ModelFieldType, TypeType } from "../../Utils/Types";
import FieldTypeInput from "../Object/FieldTypes/Input";
import FieldTypeBoolean from "../Object/FieldTypes/Boolean";
import FieldTypeRelationship from "../Object/FieldTypes/Relationship";
import FieldTypeRichText from "../Object/FieldTypes/RichText";
import FieldTypeFormula from "../Object/FieldTypes/Formula";
import { debounce } from "lodash";
import Server from "../../Utils/Server";
import uniqid from "uniqid";

const Field: React.FC<{
  field: ModelFieldType;
  mode?: "view" | "edit";
  object: TypeType;
  fieldId: string;
  setMode?: (mode: "view" | "edit") => void;
}> = ({ field, mode, object, fieldId, setMode }) => {
  var onChangeHandler = debounce((value) => {
    const requestId = uniqid();
    Server.emit("updateObject", {
      requestId,
      //@ts-ignore
      type: object.objectId,
      objectId: object._id,
      toChange: { [fieldId]: value },
    });
    Server.on(`receive-${requestId}`, (response) => {
      console.log(response);
    });
  }, 1000);

  return (
    <>
      {field.type === "input" && (
        <FieldTypeInput
          mode={mode ? mode : "edit"}
          field={field}
          object={object}
          fieldKey={fieldId}
          setMode={setMode}
          onChange={onChangeHandler}
        />
      )}
      {field.type === "boolean" && (
        <FieldTypeBoolean
          mode={mode}
          field={field}
          object={object}
          fieldKey={fieldId}
          setMode={setMode}
          onChange={onChangeHandler}
        />
      )}
      {field.type === "relationship" && (
        <FieldTypeRelationship
          mode={mode}
          field={field}
          object={object}
          fieldKey={fieldId}
          setMode={setMode}
          onChange={onChangeHandler}
        />
      )}
      {field.type === "richtext" && (
        <FieldTypeRichText
          mode={mode}
          field={field}
          object={object}
          fieldKey={fieldId}
          setMode={setMode}
          onChange={onChangeHandler}
        />
      )}
      {field.type === "formula" && (
        <FieldTypeFormula
          mode={mode}
          field={field}
          object={object}
          fieldKey={fieldId}
          setMode={setMode}
          onChange={onChangeHandler}
        />
      )}
    </>
  );
};

export default Field;

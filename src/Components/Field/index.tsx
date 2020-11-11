import React, { useState } from "react";
import {
  ModelFieldType,
  ModelType,
  ValueListItemType,
} from "../../Utils/Types";
import FieldTypeInput from "../Object/FieldTypes/Input";
import FieldTypeBoolean from "../Object/FieldTypes/Boolean";
import FieldTypeRelationship from "../Object/FieldTypes/Relationship";
import FieldTypeRichText from "../Object/FieldTypes/RichText";
import FieldTypeFormula from "../Object/FieldTypes/Formula";
import { debounce, find } from "lodash";
import Server from "../../Utils/Server";
import uniqid from "uniqid";
import InputSelect from "../Inputs/Select";

const Field: React.FC<{
  field: ModelFieldType;
  mode?: "view" | "edit" | "free";
  object;
  fieldId: string;
  setMode?: (mode: "view" | "edit" | "free") => void;
  directSave?: true;
  onChange?: (value) => void;
  directSaveDelay?: number;
  value?;
}> = ({
  field,
  mode,
  object,
  fieldId,
  setMode,
  directSave,
  onChange,
  directSaveDelay,
  value,
}) => {
  const debouncedDirectSave = debounce(
    (value) => {
      const requestId = uniqid();
      Server.emit("updateObject", {
        requestId,
        type: object.objectId,
        objectId: object._id,
        toChange: { [fieldId]: value },
      });
      Server.on(`receive-${requestId}`, (response) => {
        console.log(response);
      });
    },
    directSaveDelay ? directSaveDelay : 2500
  );
  const onChangeHandler = (value) => {
    if (directSave) debouncedDirectSave(value);
    if (onChange) onChange(value);
  };

  let options: ValueListItemType[] = [];
  if (field?.typeArgs?.options) {
    field.typeArgs.options.map((o) =>
      options.push({ label: o.label, value: o.key })
    );
  }

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
          value={value}
        />
      )}
      {field.type === "boolean" && (
        <FieldTypeBoolean
          mode={mode ? mode : "edit"}
          field={field}
          object={object}
          fieldKey={fieldId}
          setMode={setMode}
          onChange={onChangeHandler}
          value={value}
        />
      )}
      {field.type === "relationship" && (
        <FieldTypeRelationship
          mode={mode ? mode : "edit"}
          field={field}
          object={object}
          fieldKey={fieldId}
          setMode={setMode}
          onChange={onChangeHandler}
        />
      )}
      {field.type === "richtext" && (
        <FieldTypeRichText
          mode={mode ? mode : "edit"}
          field={field}
          object={object}
          fieldKey={fieldId}
          setMode={setMode}
          onChange={onChangeHandler}
        />
      )}
      {field.type === "formula" && (
        <FieldTypeFormula
          mode={mode ? mode : "edit"}
          field={field}
          object={object}
          fieldKey={fieldId}
          setMode={setMode}
          onChange={onChangeHandler}
        />
      )}
      {field.type === "options" && (
        <InputSelect
          label={field.name}
          value={find(field.typeArgs.options, (o) => {
            return o.key === object?.data[fieldId] || "";
          })}
          options={options}
          onChange={(value) => {
            onChangeHandler(value);
          }}
        />
      )}
    </>
  );
};

export default Field;

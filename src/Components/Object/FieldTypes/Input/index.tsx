import React, { useState, useEffect } from "react";
import { TextField, Grid, Typography } from "@material-ui/core";
import { ModelFieldType } from "../../../../Utils/Types";
import AppUITextField from "../../../Apps/Apps/AppUI/Forms/TextInput";
import InputInput from "../../../Inputs/Input";

const FieldTypeInput: React.FC<{
  mode: "view" | "edit" | "free";
  field: ModelFieldType;
  object: any;
  fieldKey: string;
  setMode?: (mode: "view" | "edit" | "free") => void;
  onChange: (value: any) => void;
  value?;
}> = ({ mode, field, object, fieldKey, setMode, onChange, value }) => {
  // Hooks
  const [newValue, setNewValue] = useState<any>(value);

  // Lifecycle
  useEffect(() => {
    setNewValue(value || object?.data[fieldKey]);
  }, [fieldKey, object, value]);

  // UI

  if (mode === "free")
    return (
      <AppUITextField
        label={field.name}
        value={newValue}
        onChange={(value) => {
          setNewValue(value);
          onChange(value);
        }}
      />
    );
  return (
    <div className={mode === "view" ? "view-container" : "input-container"}>
      <div
        className={
          mode === "view" ? "view-container-sub" : "input-container-sub"
        }
        style={{ width: "100%", paddingRight: 5 }}
      >
        {mode === "view" && (
          <div
            style={{ cursor: "copy" }}
            onDoubleClick={() => {
              setMode("edit");
            }}
          >
            <Grid container>
              <Grid item xs={6}>
                <Typography variant="body1" style={{ fontWeight: 500 }}>
                  {field.name}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">
                  {field?.typeArgs?.type === "password"
                    ? "········"
                    : newValue}
                </Typography>
              </Grid>
            </Grid>
          </div>
        )}
        {mode === "edit" && (
          <InputInput
            label={field.name}
            type={field.typeArgs ? field.typeArgs.type : "text"}
            value={newValue}
            onChange={(value) => {
              setNewValue(value);
              onChange(value);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default FieldTypeInput;

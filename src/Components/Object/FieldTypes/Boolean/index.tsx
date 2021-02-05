import React, { useState, useEffect } from "react";
import { Grid, Typography, Checkbox } from "@material-ui/core";
import { ModelFieldType } from "../../../../Utils/Types";
import Loading from "../../../Loading";
import InputCheckbox from "../../../Inputs/Checkbox";

const FieldTypeBoolean: React.FC<{
  mode: "view" | "edit" | "free";
  field: ModelFieldType;
  object: any;
  fieldKey: string;
  setMode?: (mode: "view" | "edit" | "free") => void;
  onChange: (value: boolean) => void;
  value?: boolean;
  disabled?: boolean;
  label?: string;
}> = ({
  mode,
  field,
  object,
  fieldKey,
  setMode,
  onChange,
  value,
  disabled,
  label,
}) => {
  // Hooks
  const [newValue, setNewValue] = useState<boolean>(
    value || (object?.data || {})[fieldKey]
  );
  // Lifecycle
  useEffect(() => {
    const defaultValue =
      field.default && typeof field.default === "boolean"
        ? (field.default as boolean)
        : field.default === "true"
        ? true
        : false;
    setNewValue(value || (object?.data || {})[fieldKey] || defaultValue);
  }, [fieldKey]);

  // UI
  if (newValue === undefined) return <Loading />;
  if (mode === "free")
    return (
      <InputCheckbox
        value={newValue || false}
        disabled={disabled}
        onChange={(newVal) => {
          setNewValue(newVal);
          onChange(newVal);
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
                <Checkbox
                  checked={newValue || false}
                  disabled
                  indeterminate={newValue !== true && newValue !== false}
                  color="primary"
                  style={{ paddingLeft: 0, marginLeft: 0 }}
                />
              </Grid>
            </Grid>
          </div>
        )}
        {mode === "edit" && (
          <InputCheckbox
            value={newValue || false}
            disabled={disabled}
            label={label}
            onChange={(newVal) => {
              setNewValue(newVal);
              onChange(newVal);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default FieldTypeBoolean;

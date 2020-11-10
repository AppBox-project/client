import React, { useState, useEffect } from "react";
import { Grid, Typography, Checkbox } from "@material-ui/core";
import { ModelFieldType } from "../../../../Utils/Types";
import Loading from "../../../Loading";

const FieldTypeBoolean: React.FC<{
  mode: "view" | "edit" | "free";
  field: ModelFieldType;
  object: any;
  fieldKey: string;
  setMode?: (mode: "view" | "edit" | "free") => void;
  onChange: (value: boolean) => void;
  value?: boolean;
  disabled?: boolean;
}> = ({
  mode,
  field,
  object,
  fieldKey,
  setMode,
  onChange,
  value,
  disabled,
}) => {
  // Hooks
  const [newValue, setNewValue] = useState<boolean>(
    value !== undefined ? value : object?.data[fieldKey]
  );
  // Lifecycle
  useEffect(() => {
    const defaultValue =
      field.default && typeof field.default === "boolean"
        ? (field.default as boolean)
        : field.default === "true"
        ? true
        : false;
    setNewValue(value ? value : object?.data[fieldKey] || defaultValue);
  }, [fieldKey]);

  // UI
  if (newValue === undefined) return <Loading />;
  const isIndeterminate = newValue !== true && newValue !== false;
  if (mode === "free")
    return (
      <Checkbox
        checked={newValue || false}
        disabled={disabled}
        indeterminate={isIndeterminate}
        color="primary"
        onChange={(event) => {
          setNewValue(event.target.checked);
          onChange(event.target.checked);
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
                  indeterminate={isIndeterminate}
                  color="primary"
                  style={{ paddingLeft: 0, marginLeft: 0 }}
                />
              </Grid>
            </Grid>
          </div>
        )}
        {mode === "edit" && (
          <Grid container>
            <Grid item xs={6}>
              <Typography variant="body1" style={{ fontWeight: 500 }}>
                {field.name}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">
                <Checkbox
                  checked={newValue || false}
                  color="primary"
                  indeterminate={isIndeterminate}
                  disabled={disabled}
                  onChange={(event) => {
                    setNewValue(event.target.checked);
                    onChange(event.target.checked);
                  }}
                />
              </Typography>
            </Grid>
          </Grid>
        )}
      </div>
    </div>
  );
};

export default FieldTypeBoolean;

import React, { useState, useEffect } from "react";
import { TextField, Grid, Typography, Checkbox } from "@material-ui/core";
import { ModelFieldType } from "../../../../Utils/Types";
import Loading from "../../../Loading";

const FieldTypeBoolean: React.FC<{
  mode: "view" | "edit" | "free";
  field: ModelFieldType;
  object: any;
  fieldKey: string;
  setMode?: (mode: "view" | "edit" | "free") => void;
  onChange: (value: boolean) => void;
}> = ({ mode, field, object, fieldKey, setMode, onChange }) => {
  // Hooks
  const [newValue, setNewValue] = useState<boolean>();
  // Lifecycle
  useEffect(() => {
    setNewValue(
      object ? (object.data[fieldKey] ? object.data[fieldKey] : false) : false
    );
  }, [fieldKey]);

  // UI
  if (newValue === undefined) return <Loading />;

  if (mode === "free")
    return (
      <Checkbox
        checked={newValue}
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
                  checked={newValue}
                  disabled
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
                  checked={newValue}
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

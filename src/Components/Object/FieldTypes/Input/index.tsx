import React, { useState, useEffect } from "react";
import { TextField, Grid, Typography } from "@material-ui/core";
import { ModelFieldType } from "../../../../Utils/Types";
import Loading from "../../../Loading";

const FieldTypeInput: React.FC<{
  mode: "view" | "edit";
  field: ModelFieldType;
  object: any;
  fieldKey: string;
  setMode: (mode: "view" | "edit") => void;
  onChange: (value: any) => void;
}> = ({ mode, field, object, fieldKey, setMode, onChange }) => {
  // Hooks
  const [newValue, setNewValue] = useState();
  // Lifecycle
  useEffect(() => {
    setNewValue(object.data[fieldKey]);
  }, [fieldKey]);

  // UI
  if (!newValue) return <Loading />;
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
                  {field.typeArgs
                    ? field.typeArgs.type === "password"
                      ? "········"
                      : newValue
                    : newValue}
                </Typography>
              </Grid>
            </Grid>
          </div>
        )}
        {mode === "edit" && (
          <TextField
            fullWidth
            label={field.name}
            margin="normal"
            type={field.typeArgs ? field.typeArgs.type : "text"}
            value={newValue}
            onChange={event => {
              setNewValue(event.target.value);
              onChange(event.target.value);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default FieldTypeInput;

import React, { useState, useEffect } from "react";
import { Grid, Typography, Checkbox } from "@material-ui/core";
import { ModelFieldType } from "../../../../Utils/Types";

const FieldTypeFormula: React.FC<{
  mode: "view" | "edit" | "free";
  field: ModelFieldType;
  object: any;
  fieldKey: string;
  setMode?: (mode: "view" | "edit" | "free") => void;
  onChange: (value: string) => void;
}> = ({ mode, field, object, fieldKey, setMode, onChange }) => {
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
                {object.data[fieldKey]}
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
                {object.data[fieldKey]}
                <br />
                (automatically calculated)
              </Typography>
            </Grid>
          </Grid>
        )}
      </div>
    </div>
  );
};

export default FieldTypeFormula;

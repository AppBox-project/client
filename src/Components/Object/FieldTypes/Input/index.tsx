import React from "react";
import { TextField, Grid, Typography } from "@material-ui/core";
import { ModelFieldType } from "../../../../Utils/Types";

const FieldTypeInput: React.FC<{
  mode: "view" | "edit";
  field: ModelFieldType;
  object: any;
  fieldKey: string;
  setMode: (mode: "view" | "edit") => void;
}> = ({ mode, field, object, fieldKey, setMode }) => {
  console.log(field);

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
                      : object.data[fieldKey]
                    : object.data[fieldKey]}
                </Typography>
              </Grid>
            </Grid>
          </div>
        )}
        {mode === "edit" && "Edit"}
      </div>
    </div>
  );
};

export default FieldTypeInput;

import React, { useState, useEffect } from "react";
import { TextField, Grid, Typography } from "@material-ui/core";
import { ModelFieldType } from "../../../../Utils/Types";
import Loading from "../../../Loading";
import InputDrafting from "../../../Forms/Drafting";

const FieldTypeRichText: React.FC<{
  mode: "view" | "edit";
  field: ModelFieldType;
  object: any;
  fieldKey: string;
  setMode?: (mode: "view" | "edit") => void;
  onChange: (value: any) => void;
}> = ({ mode, field, object, fieldKey, setMode, onChange }) => {
  // Hooks
  const [newValue, setNewValue] = useState();
  // Lifecycle
  useEffect(() => {
    setNewValue(
      object ? (object.data[fieldKey] ? object.data[fieldKey] : "") : ""
    );
  }, [fieldKey]);

  // UI
  if (newValue === undefined) return <Loading />;
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
                <Typography variant="body2">Test</Typography>
              </Grid>
            </Grid>
          </div>
        )}
        {(mode === "edit" || !mode) && (
          <>
            {field.typeArgs.type === "drafting" && (
              <InputDrafting placeholder={field.name} mode="inline" />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FieldTypeRichText;

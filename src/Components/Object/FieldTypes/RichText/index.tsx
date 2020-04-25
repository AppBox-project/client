import React, { useState, useEffect } from "react";
import { TextField, Grid, Typography } from "@material-ui/core";
import { ModelFieldType } from "../../../../Utils/Types";
import Loading from "../../../Loading";
import InputDrafting from "../../../Inputs/Drafting";

const FieldTypeRichText: React.FC<{
  mode: "view" | "edit" | "free";
  field: ModelFieldType;
  object: any;
  fieldKey: string;
  setMode?: (mode: "view" | "edit" | "free") => void;
  onChange: (value: any) => void;
}> = ({ mode, field, object, fieldKey, setMode, onChange }) => {
  // Hooks
  const [newValue, setNewValue] = useState();
  // Lifecycle
  useEffect(() => {
    setNewValue(
      object ? (object.data[fieldKey] ? object.data[fieldKey] : "") : ""
    );
  }, [fieldKey, object]);

  // Todo: changing value causes it to save (it's a change. Prevent this)

  // UI
  if (newValue === undefined) return <Loading />;
  // @ts-ignore
  if (mode === "free")
    return (
      <>
        {field.typeArgs.type === "drafting" && (
          <InputDrafting
            placeholder={field.name}
            mode="inline"
            value={newValue}
            onChange={(value) => {
              onChange(value);
            }}
          />
        )}
      </>
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
                <Typography variant="body2">Test</Typography>
              </Grid>
            </Grid>
          </div>
        )}
        {(mode === "edit" || !mode) && (
          <>
            {field.typeArgs.type === "drafting" && (
              <InputDrafting
                placeholder={field.name}
                mode="inline"
                value={newValue}
                onChange={(value) => {
                  onChange(value);
                }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FieldTypeRichText;

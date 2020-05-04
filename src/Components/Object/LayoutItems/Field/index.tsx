import React, { useState, useEffect } from "react";
import { Grid, Typography } from "@material-ui/core";
import { ModelType } from "../../../../Utils/Types";
import ObjectFieldDisplayBoolean from "../../FieldDisplay/Boolean";
import ObjectFieldDisplayInput from "../../FieldDisplay/Input";
import ObjectFieldDisplayRelationship from "../../FieldDisplay/Relationship";
import InputInput from "../../../Inputs/Input";
import styles from "./styles.module.scss";

const ObjectLayoutItemField: React.FC<{
  layoutItem;
  object;
  mode;
  setMode;
  model: ModelType;
  onChange?: (value: string) => void;
  toChange;
}> = ({ layoutItem, object, mode, setMode, model, onChange, toChange }) => {
  // Vars
  const [modelField, setModelField] = useState(model.fields[layoutItem.field]);
  const [objectField, setObjectField] = useState(
    object ? object.data[layoutItem.field] : ""
  );

  // Lifecycle
  useEffect(() => {
    setObjectField(object ? object.data[layoutItem.field] : "");
  }, [object]);
  useEffect(() => {
    setModelField(model.fields[layoutItem.field]);
  }, [model]);

  // UI
  switch (mode) {
    case "view":
      return (
        <Grid
          container
          style={{ cursor: "context-menu" }}
          className={styles.container}
          onDoubleClick={() => {
            setMode("edit");
          }}
        >
          <Grid item xs={6}>
            <Typography variant="body1" style={{ fontWeight: "bold" }}>
              {modelField.name}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            {modelField.type === "boolean" && (
              <ObjectFieldDisplayBoolean
                modelField={modelField}
                objectField={objectField}
              />
            )}
            {(modelField.type === "input" || modelField.type === "formula") && (
              <ObjectFieldDisplayInput
                modelField={modelField}
                objectField={objectField}
              />
            )}
            {modelField.type === "relationship" && (
              <ObjectFieldDisplayRelationship
                modelField={modelField}
                objectField={objectField}
              />
            )}
          </Grid>
        </Grid>
      );
    case "edit":
      return (
        <Grid
          container
          className={styles.container}
          style={{
            backgroundColor: layoutItem.field in toChange ? "#efefef" : "white",
          }}
        >
          <Grid item xs={6} style={{ verticalAlign: "middle" }}>
            <Typography
              variant="body1"
              style={{ fontWeight: "bold", verticalAlign: "middle" }}
            >
              {modelField.name}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            {modelField.type === "formula" && (
              <ObjectFieldDisplayInput
                modelField={modelField}
                objectField={objectField}
              />
            )}
            {modelField.type === "input" && (
              <InputInput
                onChange={(value) => {
                  onChange(value);
                }}
                placeholder={modelField.name}
                value={objectField}
              />
            )}
          </Grid>
        </Grid>
      );
    default:
      return <>Unknown mode</>;
  }
};

export default ObjectLayoutItemField;

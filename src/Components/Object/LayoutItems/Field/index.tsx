import React, { useState } from "react";
import { Grid, Typography } from "@material-ui/core";
import { ModelType } from "../../../../Utils/Types";
import ObjectFieldDisplayBoolean from "../../FieldDisplay/Boolean";
import ObjectFieldDisplayInput from "../../FieldDisplay/Input";
import ObjectFieldDisplayRelationship from "../../FieldDisplay/Relationship";
import InputInput from "../../../Inputs/Input";

const ObjectLayoutItemField: React.FC<{
  layoutItem;
  object;
  mode;
  setMode;
  model: ModelType;
}> = ({ layoutItem, object, mode, setMode, model }) => {
  // Vars
  const [modelField] = useState(model.fields[layoutItem.field]);
  const [objectField] = useState(object ? object.data[layoutItem.field] : "");

  // UI
  switch (mode) {
    case "view":
      return (
        <Grid
          container
          style={{ cursor: "context-menu" }}
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
          style={{ cursor: "context-menu" }}
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
            {modelField.type === "formula" && (
              <ObjectFieldDisplayInput
                modelField={modelField}
                objectField={objectField}
              />
            )}
            {modelField.type === "input" && <InputInput />}
          </Grid>
        </Grid>
      );
    default:
      return <>Unknown mode</>;
  }
};

export default ObjectLayoutItemField;

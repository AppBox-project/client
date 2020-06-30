import React, { useState, useEffect } from "react";
import { Grid, Typography } from "@material-ui/core";
import { ModelType } from "../../../../Utils/Types";
import ObjectFieldDisplayInput from "../../FieldDisplay/Input";
import InputInput from "../../../Inputs/Input";
import styles from "./styles.module.scss";
import InputCheckbox from "../../../Inputs/Checkbox";
import InputSelect from "../../../Inputs/Select";
import InputRelationShip from "../../../Inputs/Relationship";
import { find } from "lodash";
import InputPicture from "../../../Inputs/Picture";
import InputRichText from "../../../Inputs/RichText";
import InputColor from "../../../Inputs/Color";
import FieldDisplay from "../../FieldDisplay";
import InputRelationShipM from "../../../Inputs/Relationship _m";
import InputFile from "../../../Inputs/File";
import InputAddress from "../../../Inputs/Address";

const ObjectLayoutItemField: React.FC<{
  layoutItem;
  object;
  mode;
  setMode;
  model: ModelType;
  onChange?: (value: string | boolean) => void;
  toChange;
}> = ({ layoutItem, object, mode, setMode, model, onChange, toChange }) => {
  // Vars
  const [modelField, setModelField] = useState<any>(
    model.fields[layoutItem.field]
  );
  const [objectField, setObjectField] = useState<any>(
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
          <Grid item xs={4}>
            <Typography variant="body1" style={{ fontWeight: "bold" }}>
              {modelField.name}
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <FieldDisplay objectField={objectField} modelField={modelField} />
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
          <Grid item xs={4} style={{ verticalAlign: "middle" }}>
            <Typography
              variant="body1"
              style={{ fontWeight: "bold", verticalAlign: "middle" }}
            >
              {modelField.name}
            </Typography>
          </Grid>
          <Grid item xs={8}>
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
                type={modelField.typeArgs && modelField.typeArgs.type}
              />
            )}
            {modelField.type === "address" && (
              <InputAddress
                onChange={(value) => {
                  onChange(value);
                }}
                placeholder={modelField.name}
                value={objectField}
                type={modelField.typeArgs && modelField.typeArgs.type}
              />
            )}
            {modelField.type === "boolean" && (
              <InputCheckbox
                onChange={(value) => {
                  onChange(value);
                }}
                value={objectField}
              />
            )}
            {modelField.type === "relationship" && (
              <InputRelationShip
                label={modelField.name}
                value={objectField}
                objectType={modelField.typeArgs.relationshipTo}
                onChange={(value) => {
                  onChange(value);
                }}
              />
            )}{" "}
            {modelField.type === "relationship_m" && (
              <InputRelationShipM
                label={modelField.name}
                value={objectField}
                objectType={modelField.typeArgs.relationshipTo}
                onChange={(value) => {
                  onChange(value);
                }}
              />
            )}
            {modelField.type === "options" && (
              <InputSelect
                label={modelField.name}
                value={find(modelField.typeArgs.options, (o) => {
                  return o.key === objectField;
                })}
                options={modelField.typeArgs.options}
                onChange={(value) => {
                  onChange(value.key);
                }}
              />
            )}
            {modelField.type === "picture" && (
              <InputPicture
                label={modelField.name}
                value={objectField}
                model={model}
                fieldKey={objectField}
                object={object}
                onChange={(value) => {
                  onChange(value);
                }}
              />
            )}
            {modelField.type === "file" && (
              <InputFile
                label={modelField.name}
                value={objectField}
                model={model}
                fieldKey={objectField}
                object={object}
                onChange={(value) => {
                  onChange(value);
                }}
              />
            )}
            {modelField.type === "richtext" && (
              <InputRichText
                onChange={(value) => {
                  onChange(value);
                }}
                placeholder={modelField.name}
                value={objectField}
              />
            )}
            {modelField.type === "color" && (
              <InputColor
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

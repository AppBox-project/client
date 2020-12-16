import React, { useState, useEffect } from "react";
import { Grid, Typography } from "@material-ui/core";
import {
  ModelType,
  ModelFieldType,
  CustomFieldType,
  AppContextType,
  ValueListItemType,
} from "../../../../Utils/Types";
import ObjectFieldDisplayInput from "../../FieldDisplay/Input";
import InputInput from "../../../Inputs/Input";
import styles from "./styles.module.scss";
import InputSelect from "../../../Inputs/Select";
import InputRelationShip from "../../../Inputs/Relationship";
import InputPicture from "../../../Inputs/Picture";
import InputRichText from "../../../Inputs/RichText";
import InputColor from "../../../Inputs/Color";
import FieldDisplay from "../../FieldDisplay";
import InputRelationShipM from "../../../Inputs/Relationship _m";
import InputFile from "../../../Inputs/File";
import InputAddress from "../../../Inputs/Address";
import FieldTypeDate from "../../FieldTypes/Date";
import FourOhFour from "../../../FourOhFour";
import FieldTypeData from "../../FieldTypes/FreeData";
import FieldTypeBoolean from "../../FieldTypes/Boolean";

const ObjectLayoutItemField: React.FC<{
  layoutItem;
  object;
  mode;
  setMode: (mode: "view" | "edit", field?: string) => void;
  model: ModelType;
  onChange?: (value: string | boolean | Date | number | object) => void;
  toChange;
  selectedField: string;
  customFieldTypes?: { [key: string]: React.FC<CustomFieldType> };
  context: AppContextType;
  defaults;
}> = ({
  layoutItem,
  object,
  mode,
  setMode,
  model,
  onChange,
  toChange,
  customFieldTypes,
  selectedField,
  context,
  defaults,
}) => {
  // Vars
  const [modelField, setModelField] = useState<ModelFieldType>(
    model.fields[layoutItem.field]
  );
  const [objectField, setObjectField] = useState<any>(
    (object?.data || {})[layoutItem.field]
  );
  // Lifecycle
  useEffect(() => {
    setObjectField(
      toChange[layoutItem.field] || (object?.data || {})[layoutItem.field] || ""
    );
  }, [object, toChange]);
  useEffect(() => {
    setModelField(model.fields[layoutItem.field]);
  }, [model]);

  // Calculate conditions
  // Todo: respect AND OR logic
  let conditionsMet = true;
  if (modelField?.conditions) {
    modelField.conditions.conditions.map((condition) => {
      const objectField =
        toChange[condition.field] === null ||
        toChange[condition.field] === undefined
          ? (object?.data || {})[condition.field]
          : toChange[condition.field];
      if (condition.operator === "equals") {
        if (objectField !== condition.value) {
          conditionsMet = false;
        }
      }
    });
  }

  // UI
  if (!conditionsMet) return <></>;
  let options: ValueListItemType[] = [];
  if (modelField?.typeArgs?.options) {
    modelField.typeArgs.options.map((o) =>
      options.push({ value: o.key, label: o.label })
    );
  }
  // Map custom field
  let CustomField: React.FC<CustomFieldType> = FourOhFour;
  if (customFieldTypes && modelField?.typeArgs?.key)
    CustomField = customFieldTypes[modelField?.typeArgs?.key];

  switch (mode) {
    case "view":
      return layoutItem.hideView !== true ? (
        layoutItem.noLabel ? (
          <FieldDisplay
            objectField={objectField}
            modelField={modelField}
            CustomField={CustomField}
            context={context}
            object={object}
          />
        ) : (
          <Grid
            container
            className={`${styles.container} ${styles.containerView}`}
            onDoubleClick={() => {
              setMode("edit", layoutItem.field);
            }}
          >
            <Grid item xs={12} md={6}>
              <Typography variant="body1" style={{ fontWeight: "bold" }}>
                {modelField.name}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <FieldDisplay
                objectField={objectField}
                modelField={modelField}
                CustomField={CustomField}
                context={context}
                object={object}
              />
            </Grid>
          </Grid>
        )
      ) : (
        <></>
      );
    case "edit":
      return (
        !layoutItem.hideEdit && (
          <div
            className={`${styles.container} ${styles.containerEdit}${
              layoutItem.field in toChange && ` ${styles.toChange}`
            }`}
          >
            {!layoutItem.noLabel && (
              <Typography variant="body1" className={styles.titleEdit}>
                {modelField.name}
              </Typography>
            )}
            {modelField.type === "formula" && (
              <div style={{ textAlign: "center" }}>
                <ObjectFieldDisplayInput
                  modelField={modelField}
                  objectField={objectField}
                />
                <Typography style={{ fontSize: 12 }}>
                  (automatically calculated)
                </Typography>
              </div>
            )}
            {modelField.type === "input" && (
              <InputInput
                onChange={(value) => {
                  onChange(value);
                }}
                autoFocus={layoutItem.field === selectedField}
                readOnly={modelField.typeArgs?.readonly}
                placeholder={modelField.name}
                value={objectField || (defaults || {})[layoutItem.field]}
                label={modelField.name}
                type={modelField.typeArgs && modelField.typeArgs.type}
                startAdornment={
                  modelField.typeArgs?.numberType === "currency" && "€"
                }
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
              <FieldTypeBoolean
                onChange={(value) => {
                  onChange(value);
                }}
                disabled={modelField.typeArgs?.readonly || false}
                value={objectField}
                mode="free"
                field={modelField}
                object={object}
                fieldKey={layoutItem.field}
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
            )}
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
                value={toChange[layoutItem.field] || objectField || ""}
                options={options}
                multiple={modelField.typeArgs.display === "multi-dropdown"}
                onChange={(value) => {
                  onChange(value);
                }}
              />
            )}
            {modelField.type === "picture" && (
              <InputPicture
                label={modelField.name}
                value={objectField}
                model={model}
                fieldKey={objectField}
                readOnly={modelField.typeArgs?.readonly}
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
            {modelField.type === "date" && (
              <FieldTypeDate
                onChange={onChange}
                modelField={modelField}
                objectField={objectField}
              />
            )}
            {modelField.type === "data" && (
              <FieldTypeData
                onChange={onChange}
                modelField={modelField}
                objectField={objectField}
              />
            )}
            {modelField.type === "custom" && (
              <CustomField
                mode={mode}
                value={objectField}
                context={context}
                onChange={onChange}
                fullObject={object}
              />
            )}
          </div>
        )
      );
    default:
      return <>Unknown mode</>;
  }
};

export default ObjectLayoutItemField;

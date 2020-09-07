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
import FieldTypeDate from "../../FieldTypes/Date";
import FourOhFour from "../../../FourOhFour";

const ObjectLayoutItemField: React.FC<{
  layoutItem;
  object;
  mode;
  setMode;
  model: ModelType;
  onChange?: (value: string | boolean | Date | number) => void;
  toChange;
  customFieldTypes?: { [key: string]: React.FC<CustomFieldType> };
  context: AppContextType;
}> = ({
  layoutItem,
  object,
  mode,
  setMode,
  model,
  onChange,
  toChange,
  customFieldTypes,
  context,
}) => {
  // Vars
  const [modelField, setModelField] = useState<ModelFieldType>(
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
          />
        ) : (
          <div
            className={`${styles.container} ${styles.containerView}`}
            onDoubleClick={() => {
              setMode("edit");
            }}
          >
            <div style={{ width: "25%" }}>
              <Typography variant="body1" style={{ fontWeight: "bold" }}>
                {modelField.name}
              </Typography>
            </div>
            <div style={{ flex: 1 }}>
              <FieldDisplay
                objectField={objectField}
                modelField={modelField}
                CustomField={CustomField}
                context={context}
              />
            </div>
          </div>
        )
      ) : (
        <></>
      );
    case "edit":
      return (
        <div
          className={`${styles.container} ${styles.containerEdit}`}
          style={{
            backgroundColor: layoutItem.field in toChange ? "#efefef" : "white",
          }}
        >
          <Typography variant="body1" className={styles.titleEdit}>
            {modelField.name}
          </Typography>
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
                if (modelField?.typeArgs?.type === "number") {
                  onChange(parseInt(value));
                } else {
                  onChange(value);
                }
              }}
              readOnly={modelField.typeArgs?.readonly}
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
              disabled={modelField.typeArgs?.readonly || false}
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
              options={options}
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
          {modelField.type === "custom" && (
            <CustomField
              mode={mode}
              value={objectField}
              context={context}
              onChange={onChange}
            />
          )}
        </div>
      );
    default:
      return <>Unknown mode</>;
  }
};

export default ObjectLayoutItemField;

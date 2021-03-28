import React from "react";
import {
  AppContextType,
  CustomFormInputType,
  ModelType,
  ValueListItemType,
} from "../../../Utils/Types";
import { ActionLogicStepType, ActionType } from "../Types";
import styles from "./Logic.module.scss";
import { filter, find } from "lodash";
import ObjectDesigner from "../../../Components/ObjectDesigner/Create";
import ObjectDesignerFilter from "../../../Components/ObjectDesigner/Filter";
import {
  Divider,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { map } from "lodash";
import { FaCog } from "react-icons/fa";

const SettingsActionsLogic: React.FC<{
  context: AppContextType;
  action: ActionType;
  setAction;
  modelList: ValueListItemType[];
  varList: ValueListItemType[];
  models: ModelType[];
}> = ({ context, action, setAction, modelList, varList, models }) => {
  const addStep = (number?) => {
    const logic = action?.data?.data?.logic || [];
    logic.splice(number || 0, 0, { label: "New step", type: "insertObject" });
    setAction({
      ...action,
      data: {
        ...action.data,
        data: {
          ...action.data.data,
          logic,
        },
      },
    });
  };
  return (
    <>
      <div className={styles.row}>
        <div className={styles.start}>Start</div>
      </div>
      <div
        className={styles.connector}
        title="Click to add action"
        onClick={addStep}
      />
      {(action?.data?.data?.logic || []).map((step, stepIndex) => (
        <ActionLogicNode
          step={step}
          addStep={(number) => addStep(number)}
          context={context}
          modelList={modelList}
          varList={varList}
          models={models}
          setStep={(newStep) => {
            const logic = action?.data?.data?.logic;
            logic[stepIndex] = newStep;
            setAction({
              ...action,
              data: {
                ...action.data,
                data: {
                  ...action.data.data,
                  logic,
                },
              },
            });
          }}
          deleteStep={() => {
            const logic = action?.data?.data?.logic;
            logic.splice(stepIndex, 1);
            setAction({
              ...action,
              data: {
                ...action.data,
                data: {
                  ...action.data.data,
                  logic,
                },
              },
            });
          }}
          index={stepIndex}
        />
      ))}
      <div className={styles.row}>
        <div className={styles.start}>End</div>
      </div>
    </>
  );
};

export default SettingsActionsLogic;

const ActionLogicNode: React.FC<{
  step: ActionLogicStepType;
  addStep: (index) => void;
  deleteStep: () => void;
  context: AppContextType;
  setStep: (newStep: ActionLogicStepType) => void;
  modelList: ValueListItemType[];
  varList: ValueListItemType[];
  models: ModelType[];
  index: number;
}> = ({
  step,
  addStep,
  context,
  setStep,
  modelList,
  varList,
  models,
  deleteStep,
  index,
}) => (
  <>
    {step.type === "case" ? (
      <>
        <IconButton
          onClick={() => {
            context.setDialog({
              display: true,
              title: "Edit cases",
              form: [
                {
                  key: "cases",
                  value: step.args.cases,
                  label: "Cases",
                  type: "custom",
                  customInput: CustomInputCases,
                },
              ],
              buttons: [
                {
                  label: "Update",
                  onClick: (form) => {
                    console.log(form);
                  },
                },
              ],
            });
          }}
        >
          <Tooltip placement="right" title="Define cases">
            <FaCog />
          </Tooltip>
        </IconButton>
        <Grid container>Test</Grid>
      </>
    ) : (
      <>
        <div className={styles.row}>
          <div
            className={styles.step}
            onClick={() =>
              context.setDialog({
                display: true,
                title: "Edit action step",
                size: "lg",
                form: [
                  { label: "Label", key: "label", value: step.label },
                  {
                    label: "Type",
                    key: "type",
                    value: step.type,
                    type: "dropdown",
                    dropdownOptions: [
                      { label: "Assign values", value: "assignValues" },
                      { label: "Insert object", value: "insertObject" },
                      { label: "Delete objects", value: "deleteObjects" },
                      { label: "Wait", value: "wait" },
                      { label: "Wait until", value: "waitUntil" },
                      { label: "Case", value: "case" },
                    ],
                  },
                  {
                    label: "args",
                    key: "args",
                    value: step.args,
                    type: "custom",
                    customInput: CustomInputInsertObject,
                    customInputProps: { modelList, varList, models },
                    onlyDisplayWhen: { type: "insertObject" },
                  },
                  {
                    label: "args",
                    key: "args",
                    value: step.args,
                    type: "custom",
                    customInput: CustomInputDeleteObject,
                    customInputProps: { modelList, varList, models },
                    onlyDisplayWhen: { type: "deleteObjects" },
                  },
                  {
                    label: "args",
                    key: "args",
                    value: step.args,
                    type: "custom",
                    customInput: CustomInputWaitUntil,
                    customInputProps: { modelList, varList, models },
                    onlyDisplayWhen: { type: "waitUntil" },
                  },
                  {
                    label: "args",
                    key: "args",
                    value: step.args,
                    type: "custom",
                    customInput: CustomInputAssignValues,
                    customInputProps: { modelList, varList, models },
                    onlyDisplayWhen: { type: "assignValues" },
                  },
                  {
                    label: "Wait time (seconds)",
                    key: "time",
                    value: step.time,
                    onlyDisplayWhen: { type: "wait" },
                  },
                ],
                buttons: [
                  {
                    label: (
                      <Typography style={{ color: "red" }}>Delete</Typography>
                    ),
                    onClick: () => deleteStep(),
                  },
                  {
                    label: "Update",
                    onClick: (form) => setStep({ ...step, ...form }),
                  },
                ],
              })
            }
          >
            <span style={{ verticalAlign: "bottom" }}>{step.label}</span>
            <br />
            <span style={{ verticalAlign: "top", fontSize: 12 }}>
              {step.type}
            </span>
          </div>
        </div>
        <div
          className={styles.connector}
          title="Click to add action"
          onClick={() => addStep(index + 1)}
        />
      </>
    )}
  </>
);

const CustomInputInsertObject: React.FC<CustomFormInputType> = ({
  context,
  value,
  varList,
  modelList,
  onChange,
  models,
}) => {
  // Vars
  // Lifecycle
  // UI
  return (
    <>
      <context.UI.Inputs.Select
        label="Mode"
        value={value?.mode}
        onChange={(mode) => onChange({ ...value, mode })}
        options={[
          { label: "Existing var", value: "var" },
          { label: "Create new object", value: "new" },
        ]}
      />
      {value?.mode === "var" && (
        <context.UI.Inputs.Select
          label="Var"
          value={value?.varName}
          onChange={(varName) => onChange({ ...value, varName })}
          options={filter(
            varList,
            (o) => o.args.type === "object" || o.args.type === "objects"
          )}
        />
      )}
      {value?.mode === "new" && (
        <>
          <context.UI.Inputs.Select
            label="Model"
            value={value?.model}
            onChange={(model) => onChange({ ...value, model })}
            options={modelList}
          />
          {value?.model && (
            <ObjectDesigner
              model={find(models, (o) => o.key === value?.model)}
              context={context}
              value={value?.newObject}
              onChange={(newObject) => onChange({ ...value, newObject })}
            />
          )}
        </>
      )}
    </>
  );
};

const CustomInputDeleteObject: React.FC<CustomFormInputType> = ({
  context,
  value,
  varList,
  modelList,
  onChange,
  models,
}) => {
  // Vars
  // Lifecycle
  // UI
  return (
    <>
      <context.UI.Inputs.Select
        label="Delete what?"
        value={value?.mode}
        onChange={(mode) => onChange({ ...value, mode })}
        options={[
          { label: "Based on var", value: "var" },
          { label: "Free delete", value: "new" },
        ]}
      />
      {value?.mode === "var" && (
        <context.UI.Inputs.Select
          label="Var"
          value={value?.varName}
          onChange={(varName) => onChange({ ...value, varName })}
          options={filter(
            varList,
            (o) => o.args.type === "object" || o.args.type === "objects"
          )}
        />
      )}
      {value?.mode === "new" && (
        <>
          <context.UI.Inputs.Select
            label="Model"
            value={value?.model}
            onChange={(model) => onChange({ ...value, model })}
            options={modelList}
          />
          {value?.model && (
            <ObjectDesignerFilter
              model={find(models, (o) => o.key === value?.model)}
              context={context}
              value={value?.newObject}
              onChange={(newObject) => onChange({ ...value, newObject })}
            />
          )}
        </>
      )}
    </>
  );
};

const CustomInputWaitUntil: React.FC<CustomFormInputType> = ({
  context,
  value,
  varList,
  modelList,
  onChange,
  models,
}) => {
  // Vars
  const modelId = (find(varList, (o) => o.value === value?.varName) || {}).args
    ?.model;

  // Lifecycle

  // UI
  return (
    <>
      <context.UI.Inputs.Select
        label="Var"
        value={value?.varName}
        onChange={(varName) => onChange({ ...value, varName })}
        options={filter(varList, (o) => o?.args.type === "object")}
      />
      {modelId && (
        <ObjectDesignerFilter
          modelId={modelId}
          context={context}
          value={value?.object}
          onChange={(object) => onChange({ ...value, object })}
        />
      )}
    </>
  );
};

const CustomInputAssignValues: React.FC<CustomFormInputType> = ({
  context,
  value,
  varList,
  modelList,
  onChange,
  models,
}) => {
  // Vars

  // Lifecycle

  // UI
  return (
    <>
      <Divider style={{ margin: "15px 0" }} />
      <Typography variant="body1">Assign values</Typography>
      {map(value || {}, (assigned, key) => {
        const v = find(varList, (o) => o.value === key);

        let model: ModelType;
        let fieldList: ValueListItemType[] = [];
        if (v.args.type === "object") {
          model = find(modelList, (o) => o.value === v.args.model).args;
          map(model.fields, (v, k) =>
            fieldList.push({ label: v.name, value: k, args: v })
          );
        }

        return (
          <>
            <Typography variant="body1">{v.label}</Typography>
            {v.args.type === "string" && (
              <context.UI.Inputs.TextInput
                label="Set value to"
                value={assigned}
                onChange={(newVal) => onChange({ ...value, [key]: newVal })}
              />
            )}
            {v.args.type === "boolean" && (
              <context.UI.Inputs.Switch
                label="Set value to"
                value={assigned}
                onChange={(newVal) => onChange({ ...value, [key]: newVal })}
              />
            )}
            {v.args.type === "object" && (
              <>
                <ObjectDesigner
                  context={context}
                  model={model}
                  modelId={model.key}
                  value={assigned}
                  onChange={(newVal) =>
                    onChange({
                      ...value,
                      [key]: newVal,
                    })
                  }
                />
              </>
            )}
          </>
        );
      })}
      <context.UI.Inputs.Select
        label="Assign new variable"
        options={filter(
          varList,
          (o) => !Object.keys(value || {}).includes(o.value)
        )}
        onChange={(selected) => onChange({ ...value, [selected]: undefined })}
      />
      <Divider style={{ margin: "15px 0" }} />
    </>
  );
};

const CustomInputCases: React.FC<CustomFormInputType> = ({
  context,
  value,
  varList,
  modelList,
  onChange,
  models,
}) => {
  // Vars

  // Lifecycle

  // UI
  return <>Test</>;
};

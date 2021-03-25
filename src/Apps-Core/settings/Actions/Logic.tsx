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

const SettingsActionsLogic: React.FC<{
  context: AppContextType;
  action: ActionType;
  setAction;
  modelList: ValueListItemType[];
  varList: ValueListItemType[];
  models: ModelType[];
}> = ({ context, action, setAction, modelList, varList, models }) => {
  const addStep = () =>
    setAction({
      ...action,
      data: {
        ...action.data,
        data: {
          ...action.data.data,
          logic: [
            ...(action?.data?.data?.logic || []),
            { label: "New step", type: "insertObject" },
          ],
        },
      },
    });

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
          addStep={addStep}
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
  addStep: () => void;
  context: AppContextType;
  setStep: (newStep: ActionLogicStepType) => void;
  modelList: ValueListItemType[];
  varList: ValueListItemType[];
  models: ModelType[];
}> = ({ step, addStep, context, setStep, modelList, varList, models }) => (
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
                  { label: "Insert object", value: "insertObject" },
                  { label: "Wait", value: "wait" },
                  { label: "Delete objects", value: "deleteObjects" },
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
                label: "Wait time (seconds)",
                key: "time",
                value: step.time,
                onlyDisplayWhen: { type: "wait" },
              },
            ],
            buttons: [
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
        <span style={{ verticalAlign: "top", fontSize: 12 }}>{step.type}</span>
      </div>
    </div>
    <div
      className={styles.connector}
      title="Click to add action"
      onClick={addStep}
    />
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

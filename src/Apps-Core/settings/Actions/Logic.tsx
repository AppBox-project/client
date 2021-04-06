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
  GridSize,
  IconButton,
  Typography,
} from "@material-ui/core";
import { map } from "lodash";
import { FaCog, FaCogs, FaPlus } from "react-icons/fa";

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
  style?;
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
  style,
}) => (
  <>
    {step.type === "case" ? (
      <NodeCase
        step={step}
        onChange={setStep}
        context={context}
        modelList={modelList}
        varList={varList}
        models={models}
      />
    ) : step.type === "loop" ? (
      <NodeLoop
        step={step}
        onChange={setStep}
        context={context}
        modelList={modelList}
        varList={varList}
        models={models}
      />
    ) : (
      <>
        <div className={styles.row} style={style}>
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
                      { label: "Update objects", value: "updateObjects" },
                      { label: "Delete objects", value: "deleteObjects" },
                      { label: "Wait", value: "wait" },
                      { label: "Wait until", value: "waitUntil" },
                      { label: "Case", value: "case" },
                      { label: "Loop", value: "loop" },
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
                    label: "Variable",
                    key: "var",
                    value: step.var,
                    type: "dropdown",
                    dropdownOptions: filter(
                      varList,
                      (o) => o.args.type === "objects"
                    ),
                    onlyDisplayWhen: { type: "loop" },
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
                    label: "Var",
                    key: "var",
                    value: step.var,
                    type: "custom",
                    customInput: CustomInputUpdateObjects,
                    customInputProps: { modelList, varList, models },
                    onlyDisplayWhen: { type: "updateObjects" },
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
      </>
    )}
    <div
      className={styles.connector}
      title="Click to add action"
      onClick={() => addStep(index + 1)}
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
          { label: "Free delete", value: "free" },
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
      {value?.mode === "free" && (
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

const NodeCase: React.FC<{
  step;
  onChange;
  context: AppContextType;
  modelList;
  varList;
  models;
}> = ({ step, onChange, modelList, varList, models, context }) => {
  // Vars
  const cases = step.cases || [
    { criteria: "default", label: "Default case", steps: [] },
  ];
  let width: GridSize = Math.floor(12 / cases.length) as GridSize;
  if (width > 12) width = 12;
  if (width < 1) width = 1;
  const addStep = (caseIndex, number) => {
    const newCases = [...cases];
    newCases[caseIndex].steps.splice(number || 0, 0, {
      label: "New step",
      type: "insertObject",
    });

    onChange({
      ...step,
      cases: newCases,
    });
  };

  // Lifecycle
  // UI
  return (
    <div style={{ marginTop: -48 }}>
      <IconButton
        onClick={() => {
          if (cases.length < 6) {
            onChange({
              ...step,
              cases: [
                ...cases,
                { criteria: [], label: `Case ${cases.length}`, steps: [] },
              ],
            });
          }
        }}
      >
        <FaPlus />
      </IconButton>
      <Grid container style={{ marginBottom: 75 }}>
        {cases.map((c, caseIndex) => (
          <Grid item xs={width} style={{ textAlign: "center" }}>
            <Typography variant="h6">
              {c.criteria !== "default" && (
                <IconButton
                  onClick={() =>
                    context.setDialog({
                      display: true,
                      title: "Edit conditions",
                      form: [
                        { label: "Label", value: c.label, key: "label" },
                        {
                          label: "Conditions",
                          key: "conditions",
                          value: c.conditions,
                          type: "custom",
                          customInput: CustomInputCaseCriteria,
                          customInputProps: { varList, models },
                        },
                      ],
                      buttons: [
                        {
                          label: "Update",
                          onClick: (form) => {
                            const newCases = cases;
                            newCases[caseIndex] = {
                              ...newCases[caseIndex],
                              ...form,
                            };

                            console.log({
                              ...step,
                              cases: newCases,
                            });
                          },
                        },
                      ],
                    })
                  }
                >
                  <FaCogs />
                </IconButton>
              )}
              {c.label}
            </Typography>
            {c.steps.map((s, stepIndex) => (
              <ActionLogicNode
                step={s}
                addStep={(number) => addStep(caseIndex, number)}
                context={context}
                modelList={modelList}
                varList={varList}
                models={models}
                setStep={(newStep) => {
                  const newCases = cases;
                  newCases[caseIndex].steps[stepIndex] = newStep;

                  onChange({
                    ...step,
                    cases: newCases,
                  });
                }}
                deleteStep={() => {
                  const newCases = cases;
                  newCases[caseIndex].steps.splice(stepIndex, 1);

                  onChange({
                    ...step,
                    cases: newCases,
                  });
                }}
                index={stepIndex}
              />
            ))}
            <div
              className={styles.connector}
              title="Click to add action"
              onClick={() => addStep(caseIndex, cases?.steps?.length || 0)}
            />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

const NodeLoop: React.FC<{
  step;
  onChange;
  context: AppContextType;
  modelList;
  varList;
  models;
}> = ({ step, onChange, modelList, varList, models, context }) => {
  // Vars
  const v = find(varList, (o) => o.value === step.var);
  const model: ModelType = (
    find(modelList, (o) => o.value === v?.args?.model) || { args: undefined }
  ).args;

  // Functions
  const addStep = (number) => {
    const newStep = { ...step };
    if (!newStep.steps) newStep.steps = [];
    newStep.steps.splice(number || 0, 0, {
      label: "New step",
      type: "insertObject",
    });

    onChange(newStep);
  };

  return (
    <>
      <div className={styles.loopInfo}>
        <IconButton>
          <FaCog />
        </IconButton>
        {step.label}
      </div>
      <div className={styles.loop}>
        <div className={styles.loopContent}>
          {(step.steps || []).map((s, stepIndex) => (
            <ActionLogicNode
              step={s}
              addStep={(number) => addStep(number)}
              context={context}
              modelList={modelList}
              varList={[
                ...varList,
                {
                  label: `(loop) Current ${model.name}`,
                  value: `loop_current_${model.key}`,
                  args: { type: "object", model: model.key },
                },
              ]}
              models={models}
              setStep={(newStep) => {
                const newSteps = { ...step };
                newSteps.steps[stepIndex] = newStep;
                onChange(newSteps);
              }}
              deleteStep={() => {
                const newStep = { ...step };
                newStep.steps.splice(stepIndex, 1);
                onChange(newStep);
              }}
              index={stepIndex}
              style={{ zIndex: 15 }}
            />
          ))}
          <div
            className={styles.connector}
            onClick={() => addStep(step.steps?.length || 0)}
          >
            Add
          </div>
        </div>
      </div>
    </>
  );
};

const CustomInputCaseCriteria: React.FC<CustomFormInputType> = ({
  context,
  value,
  varList,
  modelList,
  onChange,
  models,
  label,
}) => {
  return (
    <>
      <Typography variant="h6">{label}</Typography>
      <context.UI.Inputs.Select
        label="Mode"
        value={value?.mode || "simple"}
        onChange={(mode) => onChange({ ...value, mode })}
        options={[
          {
            label: "Simple",
            value: "simple",
          },
          {
            label: "Formula",
            value: "formula",
          },
        ]}
      />
      {(!value?.mode || value?.mode === "simple") && (
        <>
          {(value?.criteria || []).map((crit, critIndex) => {
            const v = find(varList, (o) => o.value === crit.var);
            const onValueChange = (newVal) => {
              const criteria = value.criteria;
              criteria[critIndex].val = newVal;
              onChange({ ...value, criteria });
            };

            return (
              <div
                style={{
                  padding: 15,
                  margin: "5px 0",
                  borderTop: "1px solid black",
                  borderBottom: "1px solid black",
                }}
              >
                <context.UI.Inputs.Select
                  options={varList}
                  label="Variable"
                  value={crit.var}
                  onChange={(newVar) => {
                    const criteria = value.criteria;
                    criteria[critIndex].var = newVar;
                    onChange({ ...value, criteria });
                  }}
                />
                {v?.args?.type === "string" && (
                  <context.UI.Inputs.TextInput
                    label="Value"
                    value={crit.val}
                    onChange={onValueChange}
                  />
                )}
                {v?.args?.type === "boolean" && (
                  <context.UI.Inputs.Switch
                    label="Value"
                    value={crit.val}
                    onChange={onValueChange}
                  />
                )}
                {v?.args?.type === "object" && (
                  <ObjectDesignerFilter
                    context={context}
                    model={find(models, (o) => o.key === v.args.model)}
                    value={crit.val}
                    onChange={onValueChange}
                  />
                )}
              </div>
            );
          })}
          <IconButton
            onClick={() => {
              onChange({
                ...(value || {}),
                criteria: [...(value?.criteria || []), {}],
              });
            }}
          >
            <FaPlus />
          </IconButton>
        </>
      )}
      {value?.mode === "formula" && (
        <context.UI.Inputs.TextInput
          label="Formula"
          value={value?.formula}
          onChange={(formula) => onChange({ ...value, formula })}
        />
      )}
    </>
  );
};

const CustomInputUpdateObjects: React.FC<CustomFormInputType> = ({
  context,
  value,
  varList,
  modelList,
  onChange,
  models,
  label,
}) => {
  return (
    <context.UI.Inputs.Select
      options={varList}
      label="Var to update"
      value={value}
      onChange={(value) => onChange(value)}
    />
  );
};

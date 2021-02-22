import { Button, Divider, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import {
  AppContextType,
  InterfaceType,
  InterfaceLogicStepType,
  ModelType,
  ValueListItemType,
} from "../../../Utils/Types";
import styles from "./Logic.module.scss";
import { map } from "lodash";

const AppSettingsInterfaceLogic: React.FC<{
  newInterface: InterfaceType;
  context: AppContextType;
  setNewInterface: (newInterface) => void;
  models: ModelType[];
  modelList: ValueListItemType[];
}> = ({ newInterface, context, setNewInterface }) => {
  // Vars

  // Lifecycle

  // UI
  return (
    <>
      <div className={styles.row}>
        <div className={styles.trigger}>Trigger</div>
        <div className={styles.lineDown} />
      </div>

      {newInterface.data.data.logic.map((logicStep, stepIndex) => (
        <div key={logicStep.key} className={styles.row}>
          <div
            className={styles.step}
            onClick={() =>
              context.setDialog({
                display: true,
                size: "md",
                title: "Edit logic step",
                content: (
                  <PopupContent
                    newInterface={newInterface}
                    step={logicStep}
                    context={context}
                    onChange={(newStep) => {
                      const newSteps = newInterface.data.data.logic;
                      newSteps[stepIndex] = newStep;
                      setNewInterface({
                        ...newInterface,
                        data: {
                          ...newInterface.data,
                          data: { ...newInterface.data.data, logic: newSteps },
                        },
                      });
                      context.setDialog({ display: false });
                    }}
                  />
                ),
              })
            }
          >
            {logicStep.label}
          </div>
          <div
            className={styles.lineDown}
            onClick={() =>
              setNewInterface({
                ...newInterface,
                data: {
                  ...newInterface.data,
                  data: {
                    ...newInterface.data.data,
                    logic: [
                      ...newInterface.data.data.logic,
                      { label: "New step", key: "new" },
                    ],
                  },
                },
              })
            }
          />
        </div>
      ))}
    </>
  );
};

export default AppSettingsInterfaceLogic;

const PopupContent: React.FC<{
  step: InterfaceLogicStepType;
  onChange: (newStep) => void;
  context: AppContextType;
  newInterface: InterfaceType;
}> = ({ step, onChange, context, newInterface }) => {
  // Vars
  const [newStep, setNewStep] = useState<InterfaceLogicStepType>(step);

  // Lifecycle
  useEffect(() => {
    setNewStep(step);
  }, [step]);

  // UI
  return (
    <>
      <context.UI.Inputs.TextInput
        label="Label"
        value={newStep.label}
        onChange={(label) => setNewStep({ ...newStep, label })}
      />
      <context.UI.Inputs.TextInput
        label="Key"
        value={newStep.key}
        onChange={(key) => setNewStep({ ...newStep, key })}
      />
      <context.UI.Inputs.Select
        label="Type"
        value={newStep.type}
        onChange={(type) => setNewStep({ ...newStep, type })}
        options={[
          { label: "Render interface", value: "renderInterface" },
          { label: "Get object", value: "getObject" },
          { label: "Get objects", value: "getObjects" },
        ]}
      />
      <Divider style={{ margin: 15 }} />
      {newStep.type === "getObject" && (
        <LogicStepTypeGetObject
          step={newStep}
          onChange={(newVal) => setNewStep(newVal)}
          context={context}
          newInterface={newInterface}
        />
      )}
      {newStep.type === "getObjects" && (
        <LogicStepTypeGetObjects
          step={newStep}
          onChange={(newVal) => setNewStep(newVal)}
          context={context}
          newInterface={newInterface}
        />
      )}
      {newStep.type === "renderInterface" && (
        <LogicStepTypeshowInterface
          step={newStep}
          onChange={(newVal) => setNewStep(newVal)}
          context={context}
          newInterface={newInterface}
        />
      )}
      <Button
        style={{ float: "right" }}
        onClick={() => {
          onChange(newStep);
        }}
      >
        Save
      </Button>
    </>
  );
};

const LogicStepTypeGetObject: React.FC<{
  step: InterfaceLogicStepType;
  onChange: (newStep) => void;
  context: AppContextType;
  newInterface: InterfaceType;
}> = ({ step, onChange, context }) => {
  // Vars
  // Lifecycle
  // UI
  return <>getObject</>;
};

const LogicStepTypeGetObjects: React.FC<{
  step: InterfaceLogicStepType;
  onChange: (newStep) => void;
  context: AppContextType;
  newInterface: InterfaceType;
}> = ({ step, onChange, context, newInterface }) => {
  //Vars
  const [assignedVarOptions, setAssignedVarOptions] = useState<
    ValueListItemType[]
  >();

  // Lifecycle
  useEffect(() => {
    const nl: ValueListItemType[] = [];
    map(newInterface.data.data.variables, (v) => {
      if (v.type === "objects") {
        nl.push({ label: v.label, value: v.key });
      }
    });
    setAssignedVarOptions(nl);
  }, [newInterface]);

  // UI
  return (
    <>
      <Typography variant="h6">Get objects</Typography>
      <context.UI.Inputs.Select
        label="Variable to assign"
        value={(step?.args || {}).assignedVar}
        options={assignedVarOptions}
        onChange={(assignedVar) =>
          onChange({ ...step, args: { ...(step.args || {}), assignedVar } })
        }
      />

      {(step?.args || {}).assignedVar && (
        <>
          <br />
          <div>
            Model:{" "}
            {newInterface.data.data.variables[step.args.assignedVar].model}
          </div>
          <context.UI.Inputs.TextInput
            label="Filter"
            value={(step?.args || {}).filter || "{}"}
            onChange={(filter) =>
              onChange({ ...step, args: { ...(step.args || {}), filter } })
            }
          />
        </>
      )}
    </>
  );
};

const LogicStepTypeshowInterface: React.FC<{
  step: InterfaceLogicStepType;
  onChange: (newStep) => void;
  context: AppContextType;
  newInterface: InterfaceType;
}> = ({ step, onChange, context, newInterface }) => {
  //Vars
  const [layoutOptions, setLayoutOptions] = useState<ValueListItemType[]>();

  // Lifecycle
  useEffect(() => {
    const nl: ValueListItemType[] = [];
    map(newInterface.data.data.interfaces, (v, k) => {
      nl.push({
        label: v.label,
        value: k,
      });
    });
    setLayoutOptions(nl);
  }, [newInterface]);

  // UI
  return (
    <>
      <Typography variant="h6">Show interface</Typography>
      <context.UI.Inputs.Select
        label="Layout to render"
        value={(step?.args || {}).layoutId || "{}"}
        options={layoutOptions}
        onChange={(layoutId) =>
          onChange({
            ...step,
            args: {
              ...(step.args || {}),
              layoutId,
            },
          })
        }
      />
    </>
  );
};

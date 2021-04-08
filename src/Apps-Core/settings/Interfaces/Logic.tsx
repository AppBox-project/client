import { Button, Divider, Grid, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import {
  AppContextType,
  InterfaceType,
  InterfaceLogicStepType,
  ModelType,
  ValueListItemType,
} from "../../../Utils/Types";
import styles from "./Logic.module.scss";
import map from "lodash/map";
import uniqid from "uniqid";

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
    <div style={{ paddingBottom: 50 }}>
      <div className={styles.row}>
        <div className={styles.trigger}>{newInterface.data.name}</div>
        <div
          className={styles.lineDown}
          onClick={() => {
            const newStepId = uniqid();
            setNewInterface({
              ...newInterface,
              data: {
                ...newInterface.data,
                data: {
                  ...newInterface.data.data,
                  logic: {
                    ...(newInterface.data.data.logic || {}),
                    trigger: newStepId,
                    steps: {
                      ...(newInterface.data.data.logic?.steps || {}),
                      [newStepId]: {
                        label: "⌚ Fetch data",
                        type: "getObjects",
                        results: [{ label: "After loading" }],
                      },
                    },
                  },
                },
              },
            });
          }}
        />
      </div>
      {newInterface.data.data.logic?.trigger && (
        <RenderLogicStep
          stepId={newInterface.data.data.logic.trigger}
          step={
            newInterface.data.data.logic.steps[
              newInterface.data.data.logic.trigger
            ]
          }
          newInterface={newInterface}
          setNewInterface={setNewInterface}
          context={context}
        />
      )}
    </div>
  );
};

export default AppSettingsInterfaceLogic;

const RenderLogicStep: React.FC<{
  stepId: string;
  step: InterfaceLogicStepType;
  setNewInterface;
  newInterface;
  context: AppContextType;
}> = ({ stepId, step, setNewInterface, newInterface, context }) => {
  return (
    <>
      <div
        className={styles.row}
        onClick={() => {
          context.setDialog({
            display: true,
            title: "Edit logic step",

            content: (
              <PopupContent
                {...{ context, newInterface, step }}
                onChange={(newStep) => {
                  const newSteps = newInterface.data.data.logic;
                  newSteps.steps[stepId] = newStep;
                  console.log(newSteps);

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
          });
        }}
      >
        <div className={styles.step}>{step.label}</div>
      </div>
      <Grid container style={{ width: "100%" }}>
        {step.results.map((result, resultIndex) => (
          <Grid
            item
            key={resultIndex}
            xs={
              (12 / step.results.length) as
                | 1
                | 2
                | 3
                | 4
                | 5
                | 6
                | 7
                | 8
                | 9
                | 10
                | 11
                | 12
            }
          >
            <div
              style={{ marginTop: -50 }}
              className={styles.lineDown}
              onClick={() => {
                const newStepId = uniqid();
                const newResults =
                  newInterface.data.data.logic.steps[stepId].results;
                newResults[resultIndex].step = newStepId;
                setNewInterface({
                  ...newInterface,
                  data: {
                    ...newInterface.data,
                    data: {
                      ...newInterface.data.data,
                      logic: {
                        ...(newInterface.data.data.logic || {}),
                        steps: {
                          ...(newInterface.data.data.logic?.steps || {}),
                          [stepId]: {
                            ...newInterface.data.data.logic.steps[stepId],
                            results: newResults,
                          },
                          [newStepId]: {
                            label: "💻 Show interface",
                            type: "renderInterface",
                            results: [],
                          },
                        },
                      },
                    },
                  },
                });
              }}
            >
              <div>{result.label}</div>
            </div>
            {result.step && (
              <RenderLogicStep
                stepId={result.step}
                step={newInterface.data.data.logic.steps[result.step]}
                newInterface={newInterface}
                setNewInterface={setNewInterface}
                context={context}
              />
            )}
          </Grid>
        ))}
      </Grid>
    </>
  );
};

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
        onChange={(label: string) => setNewStep({ ...newStep, label })}
      />
      <context.UI.Inputs.Select
        label="Type"
        value={newStep.type}
        onChange={(type) =>
          setNewStep({
            ...newStep,
            type,
            results:
              type === "renderInterface"
                ? []
                : type === "getObject"
                ? [{ label: "Object fetched" }]
                : type === "getObjects"
                ? [{ label: "Objects fetched" }]
                : [], // Unknown type
          })
        }
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

import React from "react";
import {
  AppContextType,
  CustomFormInputType,
  ValueListItemType,
} from "../../../Utils/Types";
import { ActionLogicStepType, ActionType } from "../Types";
import styles from "./Logic.module.scss";

const SettingsActionsLogic: React.FC<{
  context: AppContextType;
  action: ActionType;
  setAction;
  modelList: ValueListItemType[];
  varList: ValueListItemType[];
}> = ({ context, action, setAction, modelList, varList }) => {
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
}> = ({ step, addStep, context, setStep, modelList, varList }) => (
  <>
    <div className={styles.row}>
      <div
        className={styles.step}
        onClick={() =>
          context.setDialog({
            display: true,
            title: "Edit action step",
            form: [
              { label: "Label", key: "label", value: step.label },
              step.type === "insertObject" && {
                label: "args",
                key: "args",
                type: "custom",
                customInput: CustomInputInsertObject,
                customInputProps: { modelList, varList },
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
        {step.label}
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
}) => (
  <>
    <context.UI.Inputs.Select
      label="Var"
      value={value?.var}
      options={varList}
    />
  </>
);

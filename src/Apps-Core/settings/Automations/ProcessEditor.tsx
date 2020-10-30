import { Divider, Typography } from "@material-ui/core";
import React from "react";
import { useEffect, useState } from "reactn";
import { AppContextType } from "../../../Utils/Types";
import { AutomationType, ProcessStepAction } from "../Types";
import styles from "./styles.module.scss";

const ProcessEditor: React.FC<{
  context: AppContextType;
  automation: AutomationType;
}> = ({ context, automation }) => {
  // Vars
  const [newAutomation, setNewAutomation] = useState<AutomationType>(
    automation
  );

  // Lifecycle
  useEffect(() => {
    setNewAutomation(automation);
  }, [automation]);

  // Functions
  const addTrigger = () => {
    setNewAutomation({
      ...newAutomation,
      data: {
        ...newAutomation.data,
        data: {
          ...(newAutomation.data.data || {}),
          triggers: [
            ...(newAutomation.data?.data?.triggers || []),
            { type: "cron" },
          ],
        },
      },
    });
  };
  const addStep = () => {
    setNewAutomation({
      ...newAutomation,
      data: {
        ...newAutomation.data,
        data: {
          ...(newAutomation.data.data || {}),
          steps: [
            ...(newAutomation.data?.data?.steps || []),
            {
              condition: {
                name: "Always",
                actionIfTrue: "executeSteps",
                actionIfFalse: "nextStep",
                conditions: [{ type: "always" }],
              },
              actions: [],
            },
          ],
        },
      },
    });
  };
  const addAction = (stepIndex) => {
    const newSteps = newAutomation.data?.data?.steps;
    if (!newSteps[stepIndex].actions) newSteps[stepIndex].actions = [];
    newSteps[stepIndex].actions.push({ type: "InsertObject", args: {} });
    setNewAutomation({
      ...newAutomation,
      data: {
        ...newAutomation.data,
        data: {
          ...(newAutomation.data.data || {}),
          steps: newSteps,
        },
      },
    });
  };

  // UI
  return (
    <context.UI.Animations.AnimationContainer style={{ marginBottom: 100 }}>
      <context.UI.Animations.AnimationItem>
        <div className="scrollHorizontal">
          {(newAutomation.data?.data?.triggers || []).length > 0 ? (
            <>
              {newAutomation.data.data.triggers.map((trigger, index) => (
                <div key={index} className={styles.trigger}>
                  <div className={styles.triggerTitle}>Every night</div>
                  {trigger.type}
                </div>
              ))}
              <div className={styles.triggerAdd} onClick={addTrigger}>
                <div className={styles.triggerTitle}>New</div>
                Click to add trigger
              </div>
            </>
          ) : (
            <div
              className={styles.trigger}
              onClick={addTrigger}
              style={{ marginTop: 15 }}
            >
              <div className={styles.triggerTitle}>No triggers</div>
              Click to add one
            </div>
          )}
        </div>
      </context.UI.Animations.AnimationItem>
      {(newAutomation.data.data?.steps || []).map((step, index) => (
        <context.UI.Animations.AnimationItem key={index}>
          <div className={styles.verticalLine} />
          <div
            style={{
              height: 30,
            }}
          />
          <div className="scrollHorizontal">
            <div className={styles.condition} style={{ marginTop: 15 }}>
              <div className={styles.triggerTitle}>If</div>
              {step.condition.name}
            </div>
            {step.actions.map((action, index) => (
              <div key={index} style={{ display: "inline-block" }}>
                <div className={styles.horizontalLine} />
                <div className={styles.step}>
                  <div className={styles.triggerTitle}>Do</div>
                  {action.type}
                </div>
              </div>
            ))}
            <div
              className={styles.triggerAdd}
              onClick={() => {
                addAction(index);
              }}
              style={{ marginTop: 15 }}
            >
              <div className={styles.triggerTitle}>New action</div>
              Click to add an action
            </div>
          </div>
        </context.UI.Animations.AnimationItem>
      ))}
      <context.UI.Animations.AnimationItem>
        <div
          style={{
            height: 60,
          }}
        />
        <div className="scrollHorizontal">
          <div
            className={styles.triggerAdd}
            onClick={addStep}
            style={{ marginTop: 15 }}
          >
            <div className={styles.triggerTitle}>New step</div>
            Click to add a process step
          </div>
        </div>
      </context.UI.Animations.AnimationItem>
    </context.UI.Animations.AnimationContainer>
  );
};

export default ProcessEditor;

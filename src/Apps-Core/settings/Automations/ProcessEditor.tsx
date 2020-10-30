import { Divider, Typography } from "@material-ui/core";
import React from "react";
import { useEffect, useState } from "reactn";
import { AppContextType } from "../../../Utils/Types";
import { AutomationType, ProcessStepAction } from "../Types";
import styles from "./styles.module.scss";
import { find } from "lodash";

const ProcessEditor: React.FC<{
  context: AppContextType;
  automation: AutomationType;
}> = ({ context, automation }) => {
  // Vars
  const [newAutomation, setNewAutomation] = useState<AutomationType>(
    automation
  );
  const cronOptions = [
    { label: "Every minute", value: "minutely", cron: "* * * * *" },
    { label: "Every hour", value: "hourly", cron: "0 * * * *" },
    { label: "Every other hour", value: "hourly", cron: "0 */2 * * *" },
    { label: "Every day", value: "daily", cron: "0 0 * * *" },
    { label: "Daily (at 1am)", value: "daily_1", cron: "0 1 * * *" },
    { label: "Daily (at 2am)", value: "daily_2", cron: "0 2 * * *" },
    { label: "Daily (at 8am)", value: "daily_8", cron: "0 8 * * *" },
    { label: "On mondays", value: "mondays", cron: "0 0 * * MON" },
    { label: "On tuesdays", value: "tuesdays", cron: "0 0 * * TUE" },
    { label: "On wednesdays", value: "wednesdays", cron: "0 0 * * WED" },
    { label: "On thursdays", value: "thursdays", cron: "0 0 * * THU" },
    { label: "On fridays", value: "fridays", cron: "0 0 * * FRI" },
    { label: "On saturdays", value: "saturdays", cron: "0 0 * * SAT" },
    { label: "On sundays", value: "sundays", cron: "0 0 * * SUN" },
    { label: "On weekdays", value: "weekdays", cron: "0 0 * * 1-5" },
    { label: "On the weekend", value: "weekend", cron: "0 0 * * 6,0" },
    { label: "Every week", value: "weekly", cron: "0 0 * * 0" },
    { label: "Every month", value: "monthly", cron: "0 0 1 * *" },
    { label: "Every quarter", value: "quarterly", cron: "0 0 1 */3 *" },
    { label: "Twice a year", value: "twice_yearly", cron: "0 0 1 */6 *" },
    { label: "Every year", value: "yearly", cron: "0 0 1 1 *" },
    { label: "Date / Time", value: "cron" },
  ];

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
                <div
                  key={index}
                  className={styles.trigger}
                  onClick={() => {
                    context.setDialog({
                      display: true,
                      title: "Edit trigger",
                      form: [
                        {
                          label: "Trigger",
                          key: "preset",
                          type: "dropdown",
                          dropdownOptions: cronOptions,
                        },
                      ],
                      buttons: [
                        {
                          label: "Update",
                          onClick: (form) => {
                            if (form.preset === "cron") {
                              console.log("custom cron");
                            } else {
                              const cron = find(
                                cronOptions,
                                (o) => o.value === form.preset
                              ).cron;
                              console.log(cron);
                            }
                          },
                        },
                      ],
                    });
                  }}
                >
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

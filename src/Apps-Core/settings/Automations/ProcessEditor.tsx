import { Divider, Fab, Typography } from "@material-ui/core";
import React from "react";
import { useEffect, useState } from "reactn";
import { AppContextType } from "../../../Utils/Types";
import { AutomationType, ProcessStepAction } from "../Types";
import styles from "./styles.module.scss";
import { find } from "lodash";
import { FaSave } from "react-icons/fa";
import Actions from "./ProcessEditorActions";
import ProcessEditorActions from "./ProcessEditorActions";

const ProcessEditor: React.FC<{
  context: AppContextType;
  automation: AutomationType;
}> = ({ context, automation }) => {
  // Vars
  const [newAutomation, setNewAutomation] = useState<AutomationType>(
    automation
  );
  const [hasChanged, setHasChanged] = useState<boolean>(false);
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
  useEffect(() => {
    if (JSON.stringify(automation) !== JSON.stringify(newAutomation)) {
      setHasChanged(true);
    }
  }, [automation, newAutomation]);

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
            { type: "cron", args: { cron: "0 0 * * *" }, name: "Every day" },
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
    newSteps[stepIndex].actions.push({
      name: "New action",
      type: "InsertObject",
      args: {},
    });

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

    setHasChanged(true);
  };

  // UI
  return (
    <>
      <context.UI.Animations.AnimationContainer>
        <context.UI.Animations.AnimationItem>
          <div className="scrollHorizontal">
            {(newAutomation.data?.data?.triggers || []).length > 0 ? (
              <>
                {newAutomation.data.data.triggers.map(
                  (trigger, triggerIndex) => (
                    <div
                      key={triggerIndex}
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
                              value: find(
                                cronOptions,
                                (o) => o.label === trigger.name
                              ).value,
                            },
                          ],
                          buttons: [
                            {
                              label: (
                                <Typography style={{ color: "red" }}>
                                  Delete
                                </Typography>
                              ),
                              onClick: () => {
                                const newTriggers =
                                  newAutomation.data.data.triggers;
                                delete newTriggers[triggerIndex];
                                setNewAutomation({
                                  ...newAutomation,
                                  data: {
                                    ...newAutomation.data,
                                    data: {
                                      ...newAutomation.data.data,
                                      triggers: newTriggers,
                                    },
                                  },
                                });
                              },
                            },
                            {
                              label: "Update",
                              onClick: (form) => {
                                if (form.preset === "cron") {
                                  console.log("custom cron");
                                } else {
                                  // Use a preset cronjob
                                  const cron = find(
                                    cronOptions,
                                    (o) => o.value === form.preset
                                  );
                                  const newTrigger =
                                    newAutomation.data.data.triggers[
                                    triggerIndex
                                    ];
                                  newTrigger.type = "cron";
                                  newTrigger.args["cron"] = cron.cron;
                                  newTrigger.name = cron.label;
                                  const newTriggers =
                                    newAutomation.data.data.triggers;
                                  newTriggers[triggerIndex] = newTrigger;
                                  setNewAutomation({
                                    ...newAutomation,
                                    data: {
                                      ...newAutomation.data,
                                      data: {
                                        ...newAutomation.data.data,
                                        triggers: newTriggers,
                                      },
                                    },
                                  });
                                  setHasChanged(true);
                                }
                              },
                            },
                          ],
                        });
                      }}
                    >
                      <div className={styles.triggerTitle}>{trigger.name}</div>
                      Type: {trigger.type}
                    </div>
                  )
                )}
                <div className={styles.triggerAdd} onClick={addTrigger}>
                  <div className={styles.triggerTitle}>New trigger</div>
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
        {(newAutomation.data.data?.steps || []).map((step, stepIndex) => (
          <context.UI.Animations.AnimationItem key={stepIndex}>
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
              {step.actions.map((action, actionIndex) => (
                <div key={actionIndex} style={{ display: "inline-block" }}>
                  <div className={styles.horizontalLine} />
                  <div
                    className={styles.step}
                    onClick={() => {
                      context.setDialog({
                        display: true,
                        size: "lg",
                        title: "Edit action",
                        form: [
                          {
                            key: "name",
                            label: "Describe action in words",
                            value: action.name,
                          },
                          {
                            key: "type",
                            label: "Type",
                            type: "dropdown",
                            dropdownOptions: [
                              { label: "Add object", value: "AddObject" },
                              {
                                label: "Delete objects",
                                value: "DeleteObjects",
                              },
                              { label: "Update object", value: "UpdateObject" },
                              { label: "Wait for a bit", value: "wait" },
                            ],
                            value: action.type,
                          },
                          {
                            key: "InsertObject",
                            type: "custom",
                            customInput: Actions.InsertObject,
                            label: "Insert objects",
                            onlyDisplayWhen: { type: "AddObject" },
                            value: (action.args || {})["newObject"],
                          },
                          {
                            key: "DeleteObjects",
                            type: "custom",
                            customInput: Actions.DeleteObject,
                            label: "Delete objects",
                            onlyDisplayWhen: { type: "DeleteObjects" },
                            value: (action.args || {})["DeleteObjects"],
                          },
                          {
                            key: "timeout",
                            type: "number",
                            onlyDisplayWhen: { type: "wait" },
                            label: "Wait for how long (milliseconds)",
                            value: (action.args || {})["timeout"],
                          },
                        ],
                        buttons: [
                          {
                            label: (
                              <Typography
                                variant="button"
                                style={{ color: "red" }}
                              >
                                Delete
                              </Typography>
                            ),
                            onClick: () => { },
                          },
                          {
                            label: "Update",
                            onClick: (form) => {
                              const newAction: ProcessStepAction = {
                                name: form.name,
                                type: form.type,
                                args: {
                                  newObject:
                                    form.InsertObject && form.InsertObject,
                                  DeleteObjects:
                                    form.DeleteObjects && form.DeleteObjects,
                                  timeout: form.timeout && form.timeout,
                                },
                              };
                              const newSteps = newAutomation.data.data.steps;
                              newSteps[stepIndex].actions[
                                actionIndex
                              ] = newAction;

                              setNewAutomation({
                                ...newAutomation,
                                data: {
                                  ...newAutomation.data,
                                  data: {
                                    ...newAutomation.data.data,
                                    steps: newSteps,
                                  },
                                },
                              });

                              setHasChanged(true);
                            },
                          },
                        ],
                      });
                    }}
                  >
                    <div className={styles.triggerTitle}>
                      {action.type === "wait" ? "Wait" : "Do"}
                    </div>
                    {action.name}
                  </div>
                </div>
              ))}
              <div
                className={styles.triggerAdd}
                onClick={() => {
                  addAction(stepIndex);
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
      {hasChanged && (
        <Fab
          color="primary"
          aria-label="add"
          style={{ position: "fixed", right: 15, bottom: 15 }}
          onClick={() => {
            context.updateObject(
              "system-automations",
              newAutomation.data,
              newAutomation._id
            );
            setHasChanged(false);
          }}
        >
          <FaSave />
        </Fab>
      )}
    </>
  );
};

export default ProcessEditor;

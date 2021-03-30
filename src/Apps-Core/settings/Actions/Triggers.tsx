import { Grid, Typography } from "@material-ui/core";
import React from "react";
import {
  AppContextType,
  CustomFormInputType,
  ModelType,
  ValueListItemType,
} from "../../../Utils/Types";
import { ActionType } from "../Types";
import styles from "./Triggers.module.scss";

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
  { label: "Custom", value: "cron" },
];

const SettingsActionsTriggers: React.FC<{
  context: AppContextType;
  action: ActionType;
  setAction;
  modelList: ValueListItemType[];
  varList: ValueListItemType[];
  models: ModelType[];
}> = ({ context, action, setAction, varList }) => (
  <Grid container spacing={1}>
    <Grid item xs={4}>
      <Typography variant="h6">Manual trigger</Typography>
    </Grid>
    <Grid item xs={8}>
      {action?.data?.data?.triggers?.manual ? (
        <div
          className={styles.trigger}
          onClick={() =>
            context.setDialog({
              display: true,
              title: "Edit manual trigger",
              form: [
                {
                  label: "Manual",
                  key: "manual",
                  value: action.data.data.triggers.manual,
                  type: "custom",
                  customInput: CustomInputManual,
                  customInputProps: { varList },
                },
              ],
              buttons: [
                {
                  label: (
                    <Typography style={{ color: "red" }}>
                      Delete trigger
                    </Typography>
                  ),
                  onClick: () => {
                    const newAction = { ...action };
                    delete action.data.data.triggers.manual;
                    setAction(newAction);
                  },
                },
                {
                  label: "Update trigger",
                  onClick: (form) => {
                    const newAction = { ...action };
                    newAction.data.data.triggers.manual = form.manual;
                    setAction(newAction);
                  },
                },
              ],
            })
          }
        >
          Manual trigger
        </div>
      ) : (
        <div
          className={styles.newTrigger}
          onClick={() =>
            setAction({
              ...action,
              data: {
                ...action.data,
                data: {
                  ...action.data.data,
                  triggers: { ...action?.data?.data?.triggers, manual: [] },
                },
              },
            })
          }
        >
          Add manual trigger
        </div>
      )}
    </Grid>
    <Grid item xs={4}>
      <Typography variant="h6">Time / date triggers</Typography>
    </Grid>
    <Grid item xs={8}>
      {(action?.data?.data?.triggers?.time || []).map(
        (timeTrigger, triggerIndex) => (
          <div
            key={`time-trigger-${triggerIndex}`}
            className={styles.trigger}
            onClick={() =>
              context.setDialog({
                display: true,
                title: "Edit time trigger",
                form: [
                  {
                    label: "When",
                    key: "when",
                    type: "dropdown",
                    dropdownOptions: cronOptions,
                  },
                  {
                    label: "Custom (CRON)",
                    key: "cron",
                    onlyDisplayWhen: { when: "cron" },
                  },
                ],
                buttons: [
                  { label: "Update", onClick: (form) => console.log(form) },
                ],
              })
            }
          >
            {timeTrigger.label}
          </div>
        )
      )}
      <div
        className={styles.newTrigger}
        onClick={() => {
          const time = action?.data?.data?.triggers?.time || [];
          time.push({ cron: "* * * * *", label: "Every night" });
          setAction({
            ...action,
            data: {
              ...action.data,
              data: {
                ...action.data.data,
                triggers: { ...action?.data?.data?.triggers, time },
              },
            },
          });
        }}
      >
        Add time trigger
      </div>
    </Grid>
    <Grid item xs={4}>
      <Typography variant="h6">Data triggers</Typography>
    </Grid>
    <Grid item xs={8}>
      <div className={styles.newTrigger}>Add data trigger</div>
    </Grid>
  </Grid>
);

export default SettingsActionsTriggers;

const CustomInputManual: React.FC<CustomFormInputType> = ({
  context,
  varList,
  value,
  onChange,
}) => (
  <context.UI.Inputs.Checkboxes
    label="Required variables"
    options={varList}
    value={value || []}
    onChange={(val) => onChange(val)}
    type="checkbox"
  />
);

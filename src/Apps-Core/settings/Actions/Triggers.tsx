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
                  label: "Update trigger",
                  onClick: (form) => console.log(form),
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
                  triggers: { ...action?.data?.data?.triggers, manual: {} },
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
      <div className={styles.newTrigger}>Add time trigger</div>
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
    value={value}
    onChange={(val) => onChange(val)}
    type="checkbox"
  />
);

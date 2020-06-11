import React from "react";
import { Typography, Grid, Button } from "@material-ui/core";
import styles from "./styles.module.scss";
import { AppContextType } from "../../../../Utils/Types";
import { useState, useEffect } from "reactn";

const TriggerEditor: React.FC<{
  trigger;
  context: AppContextType;
  onChange: (newValue) => void;
}> = ({ trigger, context, onChange }) => {
  // Vars
  const [newTrigger, setNewTrigger] = useState<any>({ type: "updated" }); // Contains the data for the new trigger

  // Lifecycle
  useEffect(() => {
    setNewTrigger(trigger);
  }, [trigger]);

  // UI
  return (
    <div className={styles.triggerEditor}>
      <Typography variant="h6">{newTrigger.label}</Typography>
      <Grid container>
        <Grid item xs={12}>
          <context.UI.Inputs.TextInput
            value={newTrigger?.label || ""}
            label="Name"
            onChange={(value) => {
              setNewTrigger({ ...newTrigger, label: value });
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <context.UI.Inputs.SelectInput
            label="Process triggers"
            value={newTrigger?.type}
            options={[
              { label: "when an object gets updated", value: "updated" },
              { label: "when an object gets created", value: "created" },
              {
                label: "when an object gets updated or created",
                value: "updatedOrCreated",
              },
              { label: "at a certain time or date", value: "time" },
              {
                label: "when triggered manually or by another process",
                value: "manual",
              },
            ]}
            onChange={(value) => {
              setNewTrigger({ ...newTrigger, type: value });
            }}
          />
        </Grid>

        <Grid item xs={10}>
          <Button
            color="primary"
            onClick={() => {
              onChange(newTrigger);
            }}
            fullWidth
          >
            Save
          </Button>
        </Grid>
        <Grid item xs={2}>
          <Button
            style={{ color: "red" }}
            onClick={() => {
              onChange(undefined);
            }}
            fullWidth
          >
            Remove trigger
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default TriggerEditor;

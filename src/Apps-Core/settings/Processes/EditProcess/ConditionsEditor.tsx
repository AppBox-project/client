import React from "react";
import {
  Typography,
  Grid,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import styles from "./styles.module.scss";
import { AppContextType } from "../../../../Utils/Types";
import { useState, useEffect } from "reactn";
import { map } from "lodash";

const ConditionsEditor: React.FC<{
  condition;
  context: AppContextType;
  onChange: (newValue) => void;
  contextObject: string;
}> = ({ condition, context, onChange, contextObject }) => {
  // Vars
  const [newCondition, setNewCondition] = useState<any>(condition); // Contains the data for the new condition
  const [modelFields, setModelFields] = useState<any>(); // Contains the model for the context
  // Lifecycle
  useEffect(() => {
    setNewCondition(condition);
  }, [condition]);

  // This effect loads the remote model
  useEffect(() => {
    let modelRequest;
    if (contextObject !== "system") {
      modelRequest = context.getModel(contextObject, (response) => {
        if (response.success) {
          const fields = [];
          map(response.data.fields, (f, value) => {
            fields.push({ label: f.name, value });
          });
          setModelFields(fields);
        } else {
          console.log(response);
        }
      });
    }

    return () => {
      if (modelRequest) modelRequest.stop();
    };
  }, [contextObject]);

  // UI

  return (
    <div className={styles.triggerEditor}>
      <Typography variant="h6">{newCondition.name}</Typography>
      <context.UI.Inputs.TextInput
        value={newCondition?.name || ""}
        label="Describe the conditions"
        onChange={(value) => {
          setNewCondition({ ...newCondition, name: value });
        }}
      />
      <Typography>Conditions</Typography>
      <List>
        {newCondition.conditions.map((c, index) => {
          return (
            <ListItem>
              <Grid container>
                <Grid item xs={3}>
                  <context.UI.Inputs.SelectInput
                    label="Type"
                    value={c.type || "field"}
                    options={[{ label: "Field", value: "field" }]}
                  />
                </Grid>
                <Grid item xs={3} style={{ textAlign: "center" }}>
                  <context.UI.Inputs.SelectInput
                    label="Field"
                    value={c.field || ""}
                    options={modelFields}
                    onChange={(field) => {
                      console.log(field);

                      const newConditions = newCondition.conditions;
                      newConditions[index].field = field;
                      setNewCondition({
                        ...newCondition,
                        conditions: newConditions,
                      });
                      console.log({
                        ...newCondition,
                        conditions: newConditions,
                      });
                    }}
                  />
                </Grid>
                <Grid item xs={3} style={{ textAlign: "center" }}>
                  a
                </Grid>
                <Grid item xs={3} style={{ textAlign: "center" }}>
                  a
                </Grid>
              </Grid>
            </ListItem>
          );
        })}
        <ListItem
          button
          onClick={() => {
            const cs = condition.conditions;
            cs.push({});
            setNewCondition({ ...condition, conditions: cs });
          }}
        >
          <ListItemText>Add condition</ListItemText>
        </ListItem>
      </List>
      <Button
        color="primary"
        onClick={() => {
          onChange(newCondition);
        }}
        fullWidth
      >
        Save
      </Button>
    </div>
  );
};

export default ConditionsEditor;

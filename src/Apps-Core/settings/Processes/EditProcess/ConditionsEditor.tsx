import React from "react";
import {
  Typography,
  Grid,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@material-ui/core";
import styles from "./styles.module.scss";
import { AppContextType, ModelType } from "../../../../Utils/Types";
import { useState, useEffect } from "reactn";
import { map } from "lodash";
import { GrInspect } from "react-icons/gr";

const ConditionsEditor: React.FC<{
  condition;
  context: AppContextType;
  onChange: (newValue) => void;
  contextObject: string;
}> = ({ condition, context, onChange, contextObject }) => {
  // Vars
  const [newCondition, setNewCondition] = useState<any>(condition); // Contains the data for the new condition
  const [modelFields, setModelFields] = useState<any>(); // Contains the model's fields for the context (in dropdown format)
  const [model, setModel] = useState<ModelType>(); // Contains the model for the context

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
          setModel(response.data);
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
      <Divider />
      <Typography>Conditions</Typography>
      <List>
        {newCondition.conditions.map((c, index) => {
          return (
            <ListItem>
              <ListItemIcon>
                <GrInspect />
              </ListItemIcon>
              <Grid container>
                <Grid item xs={3}>
                  <context.UI.Inputs.SelectInput
                    label="Type"
                    value={c.type}
                    onChange={(type) => {
                      const newConditions = newCondition.conditions;
                      newConditions[index].type = type;
                      setNewCondition({
                        ...newCondition,
                        conditions: newConditions,
                      });
                    }}
                    options={[
                      { label: "Field", value: "field" },
                      { label: "System", value: "system" },
                    ]}
                  />
                </Grid>
                {c.type === "field" && (
                  <>
                    <Grid item xs={3}>
                      <context.UI.Inputs.SelectInput
                        label="Field"
                        value={c.field || ""}
                        options={modelFields || []}
                        onChange={(field) => {
                          const newConditions = newCondition.conditions;
                          newConditions[index].field = field;
                          setNewCondition({
                            ...newCondition,
                            conditions: newConditions,
                          });
                        }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <context.UI.Inputs.SelectInput
                        label="Operator"
                        value={c.operator}
                        options={[
                          { label: "is", value: "is" },
                          { label: "is not", value: "is_not" },
                          { label: "starts with", value: "starts_with" },
                          { label: "ends with", value: "ends_with" },
                          { label: "contains", value: "contains" },
                          { label: "is between", value: "is_between" },
                          { label: "is higher than", value: "higher_than" },
                          { label: "is lower than", value: "lower_than" },
                        ]}
                        onChange={(operator) => {
                          const newConditions = newCondition.conditions;
                          newConditions[index].operator = operator;
                          setNewCondition({
                            ...newCondition,
                            conditions: newConditions,
                          });
                        }}
                      />
                    </Grid>
                    {(c.operator === "is" ||
                      c.operator === "is_not" ||
                      c.operator === "starts_with" ||
                      c.operator === "ends_with" ||
                      c.operator === "contains") && (
                      <Grid item xs={3}>
                        {c.field && model?.fields[c.field].type === "boolean" && (
                          <context.UI.Inputs.CheckmarkInput
                            label="Value"
                            value={c.value}
                            onChange={(value) => {
                              const newConditions = newCondition.conditions;
                              newConditions[index].value = value;
                              setNewCondition({
                                ...newCondition,
                                conditions: newConditions,
                              });
                            }}
                          />
                        )}
                      </Grid>
                    )}
                  </>
                )}
              </Grid>
            </ListItem>
          );
        })}
        <ListItem
          button
          onClick={() => {
            const cs = condition.conditions;
            cs.push({ type: "field", operator: "is" });
            setNewCondition({ ...condition, conditions: cs });
          }}
        >
          <ListItemText>Add condition</ListItemText>
        </ListItem>
      </List>
      <Divider />
      <Grid container>
        <Grid item xs={6}>
          <context.UI.Inputs.SelectInput
            label="Effect when true"
            value={newCondition.effects?.true || ""}
            options={[
              { label: "Continue to the right", value: "actions" },
              { label: "Continue downwards", value: "next_action" },
              { label: "End process", value: "end" },
            ]}
            onChange={(value) => {
              setNewCondition({
                ...newCondition,
                effects: { ...newCondition.effects, true: value },
              });
            }}
          />
        </Grid>
        <Grid item xs={6}>
          <context.UI.Inputs.SelectInput
            label="Effect when false"
            value={newCondition.effects?.false || ""}
            options={[
              { label: "Continue to the right", value: "actions" },
              { label: "Continue downwards", value: "next_action" },
              { label: "End process", value: "end" },
            ]}
            onChange={(value) => {
              setNewCondition({
                ...newCondition,
                effects: { ...newCondition.effects, false: value },
              });
            }}
          />
        </Grid>
      </Grid>
      <Divider />
      <Button
        color="primary"
        onClick={() => {
          console.log(newCondition);

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

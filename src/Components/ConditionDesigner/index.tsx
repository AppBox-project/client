import React, { useState, useEffect } from "react";
import { ModelType, SelectOptionType, ConditionsType } from "../../Utils/Types";
import {
  ListItem,
  List,
  ListItemText,
  Grid,
  ListItemIcon,
} from "@material-ui/core";
import { map } from "lodash";
import InputSelect from "../Inputs/Select";
import InputCheckbox from "../Inputs/Checkbox";

const ConditionDesigner: React.FC<{
  model: ModelType;
  value: ConditionsType;
  onChange: (value: ConditionsType) => void;
}> = ({ model, onChange, value }) => {
  // Vars
  const [fieldList, setFieldList] = useState<SelectOptionType[]>();

  // Lifecycle
  useEffect(() => {
    const nfl = [];
    map(model.fields, (v, k) => nfl.push({ label: v.name, value: k }));
    setFieldList(nfl);
  }, [model]);

  // UI
  return (
    <List>
      {(value?.conditions || []).length === 0 && (
        <ListItem>
          <ListItemText>No conditions found</ListItemText>
        </ListItem>
      )}
      {(value?.conditions || []).map((condition, index) => {
        const field = model.fields[condition.field];

        return (
          <ListItem key={index}>
            <ListItemIcon>{index + 1}</ListItemIcon>
            <ListItemText>
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <InputSelect
                    label="Field"
                    options={fieldList}
                    value={condition.field}
                    onChange={(val) => {
                      const newValue = value;
                      newValue.conditions[index].field = val.value;
                      onChange(newValue);
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <InputSelect
                    label="Operator"
                    options={[
                      { label: "is equal to", value: "equals" },
                      { label: "is not equal to", value: "not_equals" },
                    ]}
                    value={condition.operator}
                  />
                </Grid>
                <Grid item xs={4} style={{ padding: 10, paddingLeft: 15 }}>
                  {field.type === "boolean" && (
                    <InputCheckbox
                      label={condition.value ? "Checked" : "Unchecked"}
                      value={condition.value}
                      onChange={(checked) => {
                        const newValue = value;
                        newValue.conditions[index].value = checked;
                        onChange(newValue);
                      }}
                    />
                  )}
                </Grid>
              </Grid>
            </ListItemText>
          </ListItem>
        );
      })}
      <ListItem
        button
        onClick={() => {
          onChange({
            ...value,
            conditions: [
              ...(value.conditions || []),
              { field: model.primary, operator: "equals", value: "" },
            ],
          });
        }}
      >
        <ListItemText>Add condition</ListItemText>
      </ListItem>
    </List>
  );
};

export default ConditionDesigner;

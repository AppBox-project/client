import {
  Collapse,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import {
  AppContextType,
  ValueListItemType,
  ModelType,
  InterfaceType,
} from "../../../Utils/Types";
import map from "lodash/map";
import {
  FaCaretDown,
  FaCaretUp,
  FaEquals,
  FaFileImport,
  FaLocationArrow,
  FaPlus,
} from "react-icons/fa";
import InputInput from "../../../Components/Inputs/Input";
import InputSelect from "../../../Components/Inputs/Select";
import { useEffect } from "reactn";

const AppSettingsInterfaceActions: React.FC<{
  newInterface: InterfaceType;
  context: AppContextType;
  setNewInterface: (newInterface) => void;
  models: ModelType[];
  modelList: ValueListItemType[];
}> = ({ newInterface, context, setNewInterface }) => {
  // Vars
  const [varList, setVarList] = useState<ValueListItemType[]>([]);

  // Lifecycle
  useEffect(() => {
    const nl: ValueListItemType[] = [];
    map(newInterface.data.data.variables, (varValue, varKey) =>
      nl.push({ label: varValue.label, value: varKey })
    );
    setVarList(nl);
  }, [newInterface]);

  // UI
  return (
    <List>
      {map(newInterface.data.data.actions, (action, actionKey) => (
        <ListItem
          key={actionKey}
          button
          onClick={() =>
            context.setDialog({
              display: true,
              title: "Edit action",
              size: "md",
              form: [
                {
                  label: "Label",
                  key: "label",
                  value: action.label,
                  type: "text",
                },
                {
                  label: "Key",
                  key: "key",
                  value: actionKey,
                  type: "text",
                },
                {
                  type: "custom",
                  //@ts-ignore
                  customInput: ActionInput,
                  customInputProps: { varList, interfaceObject: newInterface },
                  key: "actions",
                  value: action.actions,
                  label: "Actions",
                },
              ],
              buttons: [
                {
                  label: "Update",
                  onClick: (form) => {
                    const newInt = newInterface;
                    delete newInterface.data.data.actions[actionKey];
                    newInterface.data.data.actions[form.key] = form;
                    setNewInterface(newInt);
                  },
                },
              ],
            })
          }
        >
          <ListItemIcon style={{ minWidth: 24 }}>
            <FaLocationArrow />
          </ListItemIcon>
          <ListItemText>{action.label}</ListItemText>
        </ListItem>
      ))}
      <ListItem
        button
        onClick={() => {
          setNewInterface({
            ...newInterface,
            data: {
              ...newInterface.data,
              data: {
                ...newInterface.data.data,
                actions: {
                  ...newInterface.data.data.actions,
                  new: {
                    label: "New action",
                    actions: [
                      { type: "set_variables", label: "New step", args: {} },
                    ],
                  },
                },
              },
            },
          });
        }}
      >
        <ListItemIcon style={{ minWidth: 24 }}>
          <FaPlus />
        </ListItemIcon>
        <ListItemText>Add</ListItemText>
      </ListItem>
    </List>
  );
};

export default AppSettingsInterfaceActions;

const ActionInput: React.FC<{
  value;
  onChange;
  varList?;
  interfaceObject: InterfaceType;
}> = ({ value, onChange, varList, interfaceObject }) => {
  return (
    <>
      <Typography variant="h6">Actions</Typography>
      <List>
        {(value || []).map((actionStep, actionStepIndex) => (
          <ActionStep
            varList={varList}
            key={actionStepIndex}
            actionStep={actionStep}
            onChange={(newVal) => {
              const newValue = value;
              newValue[actionStepIndex] = newVal;
              onChange(newValue);
            }}
            interfaceObject={interfaceObject}
          />
        ))}
        <ListItem
          button
          onClick={() =>
            onChange([...value, { type: "set_variables", label: "New step" }])
          }
        >
          <ListItemIcon>
            <FaPlus />
          </ListItemIcon>
          <ListItemText>Add step</ListItemText>
        </ListItem>
      </List>
    </>
  );
};

const ActionStep: React.FC<{
  actionStep;
  onChange;
  varList;
  interfaceObject: InterfaceType;
}> = ({ actionStep, onChange, varList, interfaceObject }) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <ListItem button onClick={() => setOpen(!open)}>
        <ListItemIcon>
          {actionStep.type === "set_variables" && <FaEquals />}
          {actionStep.type === "insert_object" && <FaFileImport />}
        </ListItemIcon>
        <ListItemText>{actionStep.label}</ListItemText>
        <ListItemSecondaryAction>
          {open ? <FaCaretUp /> : <FaCaretDown />}
        </ListItemSecondaryAction>
      </ListItem>
      <Collapse
        in={open}
        timeout="auto"
        unmountOnExit
        style={{
          marginLeft: 24,
          paddingLeft: 16,
          paddingTop: 16,
          paddingBottom: 16,
          borderLeft: "1px solid #485263",
        }}
      >
        <InputInput
          label="Label"
          value={actionStep.label}
          onChange={(label) => onChange({ ...actionStep, label })}
        />
        <InputSelect
          label="Type"
          value={actionStep.type}
          options={[
            { label: "Set variables", value: "set_variables" },
            { label: "Insert object", value: "insert_object" },
          ]}
          onChange={(type) => onChange({ ...actionStep, type })}
        />

        {actionStep.type === "set_variables" && (
          <>
            <Typography variant="h6">Set variable configuration</Typography>
            <Divider />
            {(actionStep.vars || []).map((v, vIndex) => (
              <Grid container spacing={3}>
                <Grid item xs={4}>
                  <InputSelect
                    label="Variable"
                    value={v.var}
                    options={varList}
                    onChange={(newVal) => {
                      const newActionStep = actionStep;
                      newActionStep.vars[vIndex].var = newVal;
                      onChange(newActionStep);
                    }}
                  />
                  {v.var &&
                    interfaceObject.data.data.variables[v.var].type ===
                      "object" && (
                      <InputInput
                        label="Model field"
                        value={v.field}
                        onChange={(newVal) => {
                          const newActionStep = actionStep;
                          newActionStep.vars[vIndex].field = newVal;
                          onChange(newActionStep);
                        }}
                      />
                    )}
                </Grid>
                <Grid item xs={4}>
                  <InputSelect
                    label="Operator"
                    value={v.operator}
                    options={[{ label: "Equals", value: "equals" }]}
                    onChange={(newVal) => {
                      const newActionStep = actionStep;
                      newActionStep.vars[vIndex].operator = newVal;
                      onChange(newActionStep);
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <InputSelect
                    label="Value type"
                    value={v.valueType || "formula"}
                    onChange={(newVal) => {
                      const newActionStep = actionStep;
                      newActionStep.vars[vIndex].valueType = newVal;
                      onChange(newActionStep);
                    }}
                    options={[
                      { label: "Formula", value: "formula" },
                      { label: "Data", value: "data" },
                    ]}
                  />
                  <InputInput
                    label="Value"
                    value={v.value}
                    onChange={(newVal) => {
                      const newActionStep = actionStep;
                      newActionStep.vars[vIndex].value = newVal;
                      onChange(newActionStep);
                    }}
                  />
                </Grid>
              </Grid>
            ))}
            <Grid
              item
              xs={12}
              onClick={() => {
                onChange({
                  ...actionStep,
                  vars: [...(actionStep.vars || []), {}],
                });
              }}
            >
              Add
            </Grid>
          </>
        )}
        {actionStep.type === "insert_object" && (
          <>
            <Typography variant="h6">Insert object configuration</Typography>
            <Divider />
            <InputSelect
              label="Variable"
              value={actionStep.var}
              options={varList}
              onChange={(newVal) => {
                onChange({ ...actionStep, var: newVal });
              }}
            />
          </>
        )}
      </Collapse>
    </>
  );
};

import React from "react";
import {
  Typography,
  Grid,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  ListItemSecondaryAction,
} from "@material-ui/core";
import styles from "./styles.module.scss";
import { AppContextType } from "../../../../Utils/Types";
import { useState, useEffect } from "reactn";
import { FaMagic } from "react-icons/fa";
import { BsTrash2Fill } from "react-icons/bs";
import { GrAdd } from "react-icons/gr";
import ProcessEditorObjectEditor from "./ObjectEditor";
import { find } from "lodash";
const ActionsEditor: React.FC<{
  actions;
  context: AppContextType;
  onChange: (newValue) => void;
  contextObject: string;
}> = ({ actions, context, onChange, contextObject }) => {
  // Vars
  const [newActions, setNewActions] = useState<any>({ type: "updated" }); // Contains the data for the new actions
  const [allModels, setAllModels] = useState<any>();

  // Lifecycle
  useEffect(() => {
    setNewActions(actions);
  }, [actions]);
  useEffect(() => {
    context.getTypes({}, (response) => {
      if (response.success) {
        const list = [];
        response.data.map((item) => {
          list.push({ label: item.name, value: item.key });
        });
        setAllModels({ list, full: response.data });
      } else {
        console.log(response);
      }
    });
  }, []);

  // UI
  return (
    <div className={styles.triggerEditor}>
      <Typography variant="h6">{newActions.label}</Typography>
      <context.UI.Inputs.TextInput
        value={actions?.label || ""}
        label="Describe the actions"
        onChange={(value) => {
          setNewActions({ ...newActions, label: value });
        }}
      />
      <Divider />

      <List>
        {newActions.actions?.map((action, index) => {
          return (
            <ListItem>
              <ListItemIcon color="primary">
                <FaMagic />
              </ListItemIcon>
              <Grid container>
                <Grid item xs={3}>
                  <context.UI.Inputs.SelectInput
                    value={action.type}
                    label="Action to perform"
                    options={[
                      { label: "Modify current object", value: "modify" },
                      { label: "Create new object", value: "create" },
                      { label: "Do nothing", value: "nothing" },
                    ]}
                    onChange={(value) => {
                      const actions = newActions.actions;
                      actions[index].type = value;
                      setNewActions({ ...newActions, actions });
                    }}
                  />
                </Grid>
                <Grid item xs={3}>
                  {action.type === "modify" && (
                    <context.UI.Inputs.SelectInput
                      value={action.action}
                      options={[
                        { label: "Set value", value: "value" },
                        { label: "Delete the object", value: "delete" },
                      ]}
                      onChange={(value) => {
                        const actions = newActions.actions;
                        actions[index].action = value;
                        setNewActions({ ...newActions, actions });
                      }}
                    />
                  )}
                  {action.type === "create" && (
                    <context.UI.Inputs.SelectInput
                      value={action.object}
                      options={allModels?.list || []}
                      label="Object to create"
                      onChange={(value) => {
                        const actions = newActions.actions;
                        actions[index].object = value;
                        setNewActions({ ...newActions, actions });
                      }}
                    />
                  )}
                </Grid>
                <Grid item xs={3}>
                  {action.type === "modify" &&
                    action.action === "value" &&
                    "Todo"}
                  {action.type === "create" && action.object && (
                    <Button
                      fullWidth
                      onClick={() => {
                        context.setDialog({
                          display: true,
                          title: "New object",
                          size: "lg",
                          content: (
                            <ProcessEditorObjectEditor
                              onSave={(value) => {
                                const actions = newActions.actions;
                                actions[index].newObject = value;
                                setNewActions({ ...newActions, actions });
                                context.setDialog({ display: false });
                              }}
                              context={context}
                              model={find(
                                allModels.full,
                                (o) => o.key === action.object
                              )}
                              object={action.newObject}
                            />
                          ),
                        });
                      }}
                      color="primary"
                      aria-required={true}
                      variant="contained"
                    >
                      {action.newObject
                        ? "Describe the object"
                        : "Edit the object"}
                    </Button>
                  )}
                </Grid>
                <Grid item xs={3}>
                  {action.type === "modify" &&
                    action.action === "value" &&
                    "Todo"}
                </Grid>
              </Grid>
              <ListItemSecondaryAction>
                <IconButton
                  onClick={() => {
                    const actions = newActions.actions;
                    actions.splice(index, 1);
                    setNewActions({ ...newActions, actions });
                  }}
                  color="primary"
                >
                  <BsTrash2Fill />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
        <ListItem
          button
          onClick={() => {
            const actions = newActions.actions;
            actions.push({
              type: "modify",
              action: "value",
            });
            setNewActions({ ...newActions, actions });
          }}
        >
          <ListItemIcon>
            <GrAdd />
          </ListItemIcon>
          <ListItemText>Add action</ListItemText>
        </ListItem>
      </List>
      <Divider />
      <Grid container>
        <Grid item xs={10}>
          <Button
            color="primary"
            onClick={() => {
              onChange(newActions);
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
            Remove actions
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default ActionsEditor;

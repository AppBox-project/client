import React, { useState, useEffect } from "react";
import { AppContextType, UIType } from "../../../Utils/Types";
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Tabs,
  Tab,
  Typography,
  ListItemIcon,
  Checkbox,
  Tooltip,
} from "@material-ui/core";
import { Switch, Route, useHistory } from "react-router-dom";
import DeleteIcon from "@material-ui/icons/Delete";

const AppQSActionTodo: React.FC<{
  match: { isExact: boolean };
  context: AppContextType;
  action: string;
}> = ({ context, action, match: { isExact } }) => {
  // General
  const currentTab = isExact
    ? ""
    : window.location.href.split(`quick-space/todo/`)[1];
  const history = useHistory();

  // Hooks
  const [projects, setProjects] = useState([]);
  const UI: UIType = context.UI;

  // Lifecycle
  useEffect(() => {
    const projectRequest = context.getObjects("qs-project", {}, (response) => {
      if (response.success) {
        setProjects(response.data);
      } else {
        console.log(response.reason);
      }
    });

    return () => {
      projectRequest.stop();
    };
  }, []);

  // UI
  if (projects === undefined || projects.length < 1) return <UI.Loading />;
  if (currentTab === "") {
    history.push(`/quick-space/todo/${projects[0]._id}`);
    return <UI.Loading />;
  }
  return (
    <div style={{ padding: 15 }}>
      <Tabs
        value={currentTab}
        onChange={(event, value) => {
          history.push(`/quick-space/todo/${value}`);
        }}
        centered
        indicatorColor="primary"
        textColor="primary"
        aria-label="Project overview"
      >
        {projects.map((project) => {
          return (
            <Tab
              label={project.data.name}
              value={project._id}
              key={project._id}
            />
          );
        })}
      </Tabs>
      <Switch>
        <Route
          path="/quick-space/todo/:projectId"
          render={(props) => {
            return <TodoList {...props} context={context} UI={UI} />;
          }}
        />
      </Switch>
    </div>
  );
};

export default AppQSActionTodo;

const TodoList: React.FC<{
  match: { params: { projectId } };
  context: AppContextType;
  UI: UIType;
}> = ({
  match: {
    params: { projectId },
  },
  context,
  UI,
}) => {
  // Hooks
  const [todos, setTodos] = useState();
  const [newTodo, setNewTodo] = useState("");

  // Lifecycle
  useEffect(() => {
    const todosRequest = context.getObjects(
      "qs-todo",
      { "data.project": projectId },
      (response) => {
        if (response.success) {
          setTodos(response.data);
        } else {
          console.log(response.reason);
        }
      }
    );

    return () => {
      setTodos(undefined);
      todosRequest.stop();
    };
  }, [projectId]);

  // UI
  if (todos === undefined) return <UI.Loading />;
  return (
    <UI.AnimationContainer>
      <List>
        <UI.AnimationItem>
          <TextField
            fullWidth
            margin="normal"
            label="Add todo"
            value={newTodo}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                context
                  .addObject("qs-todo", { action: newTodo, project: projectId })
                  .then(
                    () => {},
                    (reason) => {
                      console.log(reason);
                    }
                  );
                setNewTodo("");
              }
            }}
            onChange={(e) => {
              setNewTodo(e.target.value);
            }}
          />
        </UI.AnimationItem>
        {todos.map((todo) => {
          if (!todo.data.done) {
            return (
              <UI.AnimationItem>
                <ListItem>
                  <ListItemIcon>
                    <Checkbox
                      color="primary"
                      onChange={() => {
                        context
                          .updateObject("qs-todo", { done: true }, todo._id)
                          .then(
                            () => {},
                            (feedback) => {
                              console.log(feedback);
                            }
                          );
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText>{todo.data.action}</ListItemText>
                </ListItem>
              </UI.AnimationItem>
            );
          }
        })}
      </List>
      <UI.AnimationItem>
        <Typography variant="subtitle2" style={{ marginTop: 15 }}>
          Completed
        </Typography>
      </UI.AnimationItem>
      <List>
        {todos.map((todo) => {
          if (todo.data.done) {
            return (
              <UI.AnimationItem>
                <ListItem>
                  <ListItemIcon>
                    <Checkbox
                      color="primary"
                      checked={true}
                      onChange={() => {
                        context
                          .updateObject("qs-todo", { done: false }, todo._id)
                          .then(
                            () => {},
                            (feedback) => {
                              console.log(feedback);
                            }
                          );
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText>{todo.data.action}</ListItemText>
                  <ListItemSecondaryAction>
                    <Tooltip title="Permently delete" placement="left">
                      <IconButton
                        color="primary"
                        onClick={() => {
                          context
                            .deleteObjects("qs-todo", { _id: todo._id })
                            .then(
                              () => {},
                              (reason) => {
                                console.log(reason);
                              }
                            );
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
              </UI.AnimationItem>
            );
          }
        })}
      </List>
    </UI.AnimationContainer>
  );
};

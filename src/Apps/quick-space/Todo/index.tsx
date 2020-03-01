import React, { useState, useEffect } from "react";
import { AppContextType, UIType } from "../../../Utils/Types";
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Grid,
  Tabs,
  Tab
} from "@material-ui/core";
import { FaTrash } from "react-icons/fa";
import { Link, Switch, Route, useHistory } from "react-router-dom";

const AppActionTodo: React.FC<{
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
    context.getObjects("qs-todo-project", {}, response => {
      if (response.success) {
        setProjects(response.data);
      } else {
        console.log(response.reason);
      }
    });
  }, []);

  // UI
  if (projects === undefined) return <UI.Loading />;
  return (
    <div style={{ padding: 15 }}>
      <Tabs
        value={currentTab}
        onChange={(event, value) => {
          history.push(`/quick-space/todo/${value}`);
        }}
        centered
        aria-label="simple tabs example"
      >
        {projects.map(project => {
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
          render={props => {
            return <TodoList {...props} context={context} UI={UI} />;
          }}
        />
      </Switch>
    </div>
  );
};

export default AppActionTodo;

const TodoList: React.FC<{
  match: { params: { projectId } };
  context: AppContextType;
  UI: UIType;
}> = ({
  match: {
    params: { projectId }
  },
  context,
  UI
}) => {
  // Hooks
  const [todos, setTodos] = useState();
  const [newTodo, setNewTodo] = useState("");

  // Lifecycle
  useEffect(() => {
    context.getObjects("qs-todo", { "data.project": projectId }, response => {
      if (response.success) {
        setTodos(response.data);
      } else {
        console.log(response.reason);
      }
    });

    return () => {
      setTodos(undefined);
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
            onKeyDown={e => {
              if (e.key === "Enter") {
                context
                  .addObject("qs-todo", { action: newTodo, project: projectId })
                  .then(
                    () => {},
                    reason => {
                      console.log(reason);
                    }
                  );
                setNewTodo("");
              }
            }}
            onChange={e => {
              setNewTodo(e.target.value);
            }}
          />
        </UI.AnimationItem>
        {todos.map(todo => {
          return (
            <UI.AnimationItem>
              <ListItem button>
                <ListItemText>{todo.data.action}</ListItemText>
                <ListItemSecondaryAction>
                  <IconButton
                    onClick={() => {
                      context.deleteObjects("qs-todo", { _id: todo._id }).then(
                        () => {},
                        reason => {
                          console.log(reason);
                        }
                      );
                    }}
                  >
                    <FaTrash />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </UI.AnimationItem>
          );
        })}
      </List>
    </UI.AnimationContainer>
  );

  /*return <List>
  {map(todos, (todo, key) => {
    return (
      <UI.AnimationItem key={key}>
        <ListItem button>
          <ListItemText>{todo.data.action}</ListItemText>
          <ListItemSecondaryAction>
            <IconButton
              onClick={() => {
                context
                  .deleteObjects("qs-todo", { _id: todo._id })
                  .then(
                    () => {},
                    reason => {
                      console.log(reason);
                    }
                  );
              }}
            >
              <FaTrash />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      </UI.AnimationItem>
    );
  })}
</List>*/
};

import React, { useState, useEffect } from "react";
import { AppContextType } from "../../../Utils/Types";
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField
} from "@material-ui/core";
import { FaTrash } from "react-icons/fa";
import { map } from "lodash";

const AppActionTodo: React.FC<{ context: AppContextType; action: string }> = ({
  context,
  action
}) => {
  const [todos, setTodos] = useState();
  const UI = context.UI;
  const [newTodo, setNewTodo] = useState("");

  // Lifecycle
  useEffect(() => {
    context.getObjects("qs-todo", {}, response => {
      if (response.success) {
        setTodos(response.data);
      } else {
        console.log(response.reason);
      }
    });
  }, []);

  // UI
  if (!todos) return <UI.Loading />;
  return (
    <div style={{ padding: 15 }}>
      <UI.AnimationContainer>
        <UI.AnimationItem>
          <TextField
            fullWidth
            margin="normal"
            label="Add todo"
            value={newTodo}
            onKeyDown={e => {
              if (e.key === "Enter") {
                context.addObject("qs-todo", { action: newTodo }).then(
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
        <List>
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
        </List>
      </UI.AnimationContainer>
    </div>
  );
};

export default AppActionTodo;

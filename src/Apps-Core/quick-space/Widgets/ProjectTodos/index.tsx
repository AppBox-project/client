import React from "react";
import { useState, useEffect } from "reactn";
import { Skeleton } from "@material-ui/lab";
import styles from "./styles.module.scss";
import { List, ListItem, ListItemText } from "@material-ui/core";
import { WidgetContextType, ObjectType } from "../../../../Utils/Types";

const WidgetProjectTodos: React.FC<{ context: WidgetContextType }> = ({
  context,
}) => {
  // Vars
  const [todos, setTodos] = useState<ObjectType[]>();

  // Lifecycle
  useEffect(() => {
    context.getObjects(
      "qs-todo",
      { "data.owner": context.user._id, "data.done": { $ne: true } },
      (response) => {
        if (response.success) {
          setTodos(response.data);
        } else {
          console.log(response);
        }
      }
    );
  });

  // UI
  if (!todos) return <LoadingSkeleton />;
  return (
    <div className={styles.root}>
      <List>
        {todos.map((todo) => (
          <ListItem key={todo._id}>
            <ListItemText>{todo.data.action}</ListItemText>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

const LoadingSkeleton: React.FC = () => {
  return <Skeleton />;
};

export const getSettings = new Promise((resolve, reject) => {
  resolve([1, 2]);
});

export default WidgetProjectTodos;

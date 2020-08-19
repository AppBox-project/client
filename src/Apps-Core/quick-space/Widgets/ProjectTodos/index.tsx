import React from "react";
import { useState, useEffect } from "reactn";
import { Skeleton } from "@material-ui/lab";
import styles from "./styles.module.scss";
import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
} from "@material-ui/core";
import { ObjectType } from "../../../../Utils/Types";
import WidgetContext from "../../../../Components/Apps/Apps/WidgetContext";
import { useHistory } from "react-router-dom";

const WidgetProjectTodos: React.FC<{ context: WidgetContext }> = ({
  context,
}) => {
  // Vars
  const [todos, setTodos] = useState<ObjectType[]>();
  const history = useHistory();

  // Lifecycle
  useEffect(() => {
    const request = context.getObjects(
      "qs-todo",
      {
        "data.owner": context.user._id,
        "data.done": { $ne: true },
        "data.project": context.widgetSettings?.project,
      },
      (response) => {
        if (response.success) {
          setTodos(response.data);
        } else {
          console.log(response);
        }
      }
    );

    return () => {
      request.stop();
    };
  }, [context.widgetSettings]);

  // UI
  if (!todos) return <LoadingSkeleton />;
  return (
    <div className={styles.root}>
      <List>
        {todos.map((todo) => (
          <ListItem
            key={todo._id}
            onClick={() => {
              history.push(`/o/${todo._id}`);
            }}
            style={{ cursor: "pointer" }}
          >
            <ListItemIcon>
              <Checkbox />
            </ListItemIcon>
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

export const getSettings = (context: WidgetContext) => {
  return new Promise((resolve, reject) => {
    context.getObjects("qs-project", {}, (response) => {
      if (response.success) {
        const options = [];
        response.data.map((p) => {
          options.push({ label: p.data.name, value: p._id });
        });
        resolve([
          {
            key: "project",
            label: "Project",
            type: "dropdown",
            dropdownOptions: options,
            value: options[0].value,
          },
        ]);
      } else {
        reject(response);
      }
    });
  });
};

export default WidgetProjectTodos;

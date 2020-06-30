import React, { useState, useEffect, Context } from "react";
import { WidgetContextType } from "../../../../Utils/Types";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@material-ui/core";

const AppWidgetTodo: React.FC<{
  projectId: string;
  context: WidgetContextType;
}> = ({ projectId, context }) => {
  // Vars
  const [project, setProject] = useState<any>();
  const [todos, setTodos] = useState<any>();

  // Lifecycle
  useEffect(() => {
    const projectRequest = context.getObjects(
      "qs-project",
      { _id: projectId, "data.owner": context.user._id },
      (response) => {
        if (response.success) {
          setProject(response.data[0]);
        } else {
          console.log(response);
        }
      }
    );

    const todoRequest = context.getObjects(
      "qs-todo",
      { "data.project": projectId, "data.done": { $ne: true } },
      (response) => {
        if (response.success) {
          setTodos(response.data);
        } else {
          console.log(response);
        }
      }
    );

    return () => {
      projectRequest.stop();
      todoRequest.stop();
    };
  }, [projectId]);

  // UI
  if (!project) return <>Ohno</>;
  return (
    <div style={{ margin: 15 }}>
      <Typography variant="h6" style={{ cursor: "pointer" }}>
        Todo's in <i>{project.data.name}</i>
      </Typography>
      {todos ? (
        <List>
          {todos.map((todo) => {
            return (
              <ListItem key={todo._id}>
                <ListItemIcon>
                  <context.UI.Field
                    modelId="qs-todo"
                    fieldId="done"
                    objectId={todo._id}
                    object={todo}
                    mode="free"
                    directSave
                    directSaveDelay={1}
                  />
                </ListItemIcon>
                <ListItemText>{todo.data.action}</ListItemText>
              </ListItem>
            );
          })}
        </List>
      ) : (
        <context.UI.Loading label="Loading to-do's" />
      )}
    </div>
  );
};

export default AppWidgetTodo;

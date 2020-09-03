import React, { useState } from "react";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  ListItemSecondaryAction,
  IconButton,
  Collapse,
  TextField,
} from "@material-ui/core";
import { GoTasklist } from "react-icons/go";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import { filter } from "lodash";
import { FaStickyNote } from "react-icons/fa";
import { AppContextType, ModelType } from "../../../Utils/Types";
import { useHistory } from "react-router-dom";
import { AppTodoType } from "../Types";
import { useEffect } from "reactn";

const AppQSActionTodoDetailTodo: React.FC<{
  todo: AppTodoType;
  context: AppContextType;
  model: ModelType;
  isMobile: boolean;
  key?: string;
}> = ({ todo, context, model, isMobile }) => {
  // Vars
  const [tempChecked, setTempChecked] = useState<boolean>(
    todo.data.done || false
  );
  // Lifecycle
  useEffect(() => {
    setTempChecked(todo.data.done || false);
  }, [todo]);
  // UI
  return (
    <ListItem disabled={tempChecked !== (todo.data.done || false)}>
      <ListItemIcon>
        <context.UI.Inputs.CheckmarkInput
          value={todo.data.done || false}
          onChange={(value: boolean) => {
            setTempChecked(value);
            context.updateObject("qs-todo", { done: value }, todo._id);
          }}
        />
      </ListItemIcon>
      <ListItemText
        style={{ cursor: "pointer" }}
        onClick={() => {
          context.setDialog({
            display: true,
            size: "md",
            title: todo.data.action,
            content: (
              <context.UI.Layouts.Object.ObjectLayout
                model={model}
                layoutId="popup"
                popup
                context={context}
                objectId={todo._id}
                onObjectDisappears={() => {
                  context.setDialog({ display: false });
                }}
              />
            ),
          });
        }}
        primary={todo.data.action}
        secondary={
          <>
            {todo.data.description && (
              <>
                {todo.data.description}
                <br />
              </>
            )}
            {todo.data.status && isMobile && (
              <>
                <Chip
                  variant="outlined"
                  label={todo.data.status}
                  size="small"
                />{" "}
              </>
            )}
            {todo.data.tags && (
              <context.UI.FieldDisplay
                objectField={todo.data.tags}
                modelField={model.fields.tags}
                props={{ size: "small" }}
              />
            )}
            {todo.data.relatedNotes && todo.data.relatedNotes.length > 0 && (
              <>
                {" "}
                <Chip
                  label={`${todo.data.relatedNotes.length} ${
                    todo.data.relatedNotes.length === 1 ? "note" : "notes"
                  }`}
                  icon={<FaStickyNote style={{ width: 12, height: 12 }} />}
                  size="small"
                  variant="outlined"
                />
              </>
            )}
            {todo.data.related_todos && todo.data.related_todos.length > 0 && (
              <>
                {" "}
                <Chip
                  label={`${todo.data.related_todos.length} related`}
                  icon={<GoTasklist style={{ width: 12, height: 12 }} />}
                  size="small"
                  variant="outlined"
                />
              </>
            )}
          </>
        }
      />
    </ListItem>
  );
};

export default AppQSActionTodoDetailTodo;

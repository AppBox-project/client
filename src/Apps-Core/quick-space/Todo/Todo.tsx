import React, { useState } from "react";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  ListItemSecondaryAction,
  IconButton,
  Collapse,
} from "@material-ui/core";
import { GoTasklist } from "react-icons/go";
import { FaStickyNote } from "react-icons/fa";
import { AppContextType, ModelType } from "../../../Utils/Types";
import { AppTodoType } from "../Types";
import { useEffect } from "reactn";
import { AiOutlineUp, AiOutlineDown } from "react-icons/ai";
import { filter } from "lodash";

const AppQSActionTodoDetailTodo: React.FC<{
  todo: AppTodoType;
  context: AppContextType;
  model: ModelType;
  isMobile: boolean;
  key?: string;
  subTodos?: AppTodoType[];
  allTodos?: AppTodoType[];
  level?: number;
  hideStatus?: boolean;
}> = ({
  todo,
  context,
  model,
  isMobile,
  subTodos,
  level,
  allTodos,
  hideStatus,
}) => {
  // Vars
  const [tempChecked, setTempChecked] = useState<boolean>(
    todo.data.done || false
  );
  const [expanded, setExpanded] = useState<boolean>(false);

  // Lifecycle
  useEffect(() => {
    setTempChecked(todo.data.done || false);
  }, [todo]);

  // UI
  return (
    <>
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
        {(((todo.data.status || todo.data.tags) && !isMobile && !hideStatus) ||
          (subTodos || []).length) > 0 && (
          <ListItemSecondaryAction>
            {(todo.data.status || todo.data.tags) &&
              !isMobile &&
              todo.data.status && (
                <Chip
                  variant="outlined"
                  label={todo.data.status}
                  size="small"
                />
              )}{" "}
            {(subTodos || []).length > 0 && (
              <IconButton
                onClick={() => {
                  setExpanded(!expanded);
                }}
              >
                {expanded ? (
                  <AiOutlineUp style={{ width: 18, height: 18 }} />
                ) : (
                  <AiOutlineDown style={{ width: 18, height: 18 }} />
                )}
              </IconButton>
            )}
          </ListItemSecondaryAction>
        )}
      </ListItem>
      {(subTodos || []).length > 0 && (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <div
            style={{
              marginLeft: level * 35,
              borderLeft: "1px dashed #efefef",
            }}
          >
            {subTodos.map((subTodo) => (
              <AppQSActionTodoDetailTodo
                todo={subTodo}
                context={context}
                model={model}
                isMobile={isMobile}
                key={subTodo._id}
                level={level + 1}
                allTodos={allTodos}
                subTodos={filter(
                  allTodos,
                  (t: AppTodoType) => t.data.belongs_to === todo._id
                )}
              />
            ))}
          </div>
        </Collapse>
      )}
    </>
  );
};

export default AppQSActionTodoDetailTodo;

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

const AppQSActionTodoDetailTodo: React.FC<{
  subTodos;
  todo;
  context: AppContextType;
  model: ModelType;
  isMobile: boolean;
  level: number;
  projectId;
}> = ({ subTodos, todo, context, model, isMobile, level, projectId }) => {
  // Vars
  const [expanded, setExpanded] = useState<any>(false); // Used for expanding sub-items
  const [localChecked, setLocalChecked] = useState<any>(false); // On check this state will be set before real-time data, allowing graying out of item during load.
  const [newTodo, setNewTodo] = useState<any>(""); // Used for controlling the 'new todo' input on a sub-item list.
  const history = useHistory();

  let subItems = filter(
    subTodos,
    (o) => o.data.belongs_to === todo._id && o.data.done != true
  ); // Checks for existing sub-items

  // Lifecycle

  // UI
  return (
    <>
      <ListItem
        key={todo._id}
        style={{
          cursor: "pointer",
          opacity: localChecked ? 0.6 : 1,
        }}
        button
        disabled={localChecked}
      >
        <ListItemIcon>
          <context.UI.Field
            field={model.fields["done"]}
            fieldId="done"
            objectId={todo._id}
            object={todo}
            mode="free"
            directSave
            directSaveDelay={1}
            onChange={() => {
              setLocalChecked(true);
            }}
          />
        </ListItemIcon>
        <ListItemText
          onClick={(object) => {
            context.setDialog({
              display: true,
              size: "md",
              title: todo.data.action,
              onClose: () => {
                history.push(window.location.pathname.split("#")[0]);
              },

              content: (
                <context.UI.Layouts.Object.ObjectLayout
                  model={model}
                  layoutId="popup"
                  popup
                  appId="quick-space"
                  objectId={todo._id}
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
              {todo.data.relates_to && todo.data.relates_to.length > 0 && (
                <>
                  {" "}
                  <Chip
                    label={`${todo.data.relates_to.length} related`}
                    icon={<GoTasklist style={{ width: 12, height: 12 }} />}
                    size="small"
                    variant="outlined"
                  />
                </>
              )}
            </>
          }
        />
        {(((todo.data.status || todo.data.tags) && !isMobile) ||
          subItems.length) > 0 && (
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
            {subItems.length > 0 && (
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
      {subItems.length > 0 && (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <div
            style={{ marginLeft: level * 35, borderLeft: "1px dashed #efefef" }}
          >
            <TextField
              fullWidth
              margin="normal"
              label={`Add todo to '${todo.data.action}'`}
              value={newTodo}
              style={{ margin: "0 15px", width: "98%" }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  context.addObject(
                    "qs-todo",
                    {
                      action: newTodo,
                      project: projectId,
                      belongs_to: todo._id,
                      owner: context.user._id,
                    },
                    (response) => {
                      console.log(response);
                    }
                  );

                  setNewTodo("");
                }
              }}
              onChange={(e) => {
                setNewTodo(e.target.value);
              }}
            />
            <context.UI.Layouts.SortableList
              listItems={subItems}
              baseUrl=""
              customItem={(item) => {
                return (
                  <AppQSActionTodoDetailTodo
                    subTodos={subTodos}
                    todo={item}
                    context={context}
                    model={model}
                    isMobile={isMobile}
                    level={level + 1}
                    projectId={projectId}
                  />
                );
              }}
            />
          </div>
        </Collapse>
      )}
    </>
  );
};

export default AppQSActionTodoDetailTodo;

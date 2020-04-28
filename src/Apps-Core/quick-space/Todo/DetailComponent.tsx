import React, { useState, useEffect } from "react";
import { AppContextType } from "../../../Utils/Types";
import { filter, sortBy } from "lodash";
import { Grid, Paper, Typography, TextField } from "@material-ui/core";

const AppQSActionTodoDetail: React.FC<{
  context: AppContextType;
  match: { params: { detailId } };
}> = ({
  context,
  match: {
    params: { detailId },
  },
}) => {
  // Vars
  const [todos, setTodos] = useState();
  const [doneTodos, setDoneTodos] = useState();
  const [newTodo, setNewTodo] = useState("");
  // Todo: performance optimization: already load model here so it doesn have to be loaded each checklist item

  // Lifecycle
  useEffect(() => {
    const todoRequest = context.getObjects(
      "qs-todo",
      { "data.project": detailId },
      (response) => {
        if (response.success) {
          setTodos(sortBy(filter(response.data, (o) => {
              return o.data.done !== true;
            }), ["data.order"])
          );
          setDoneTodos(
            filter(response.data, (o) => {
              return o.data.done === true;
            })
          );
        } else {
          console.log(response);
        }
      }
    );

    return () => {
      todoRequest.stop();
    };
  }, [detailId]);

  // UI
  if (!todos) return <context.UI.Loading />;
  return (
    <Grid container>
      <Grid item xs={12} md={8}>
        <TextField
          fullWidth
          margin="normal"
          label="Add todo"
          value={newTodo}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              context
                .addObject("qs-todo", { action: newTodo, project: detailId })
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
        <context.UI.Layouts.SortableList
          listItems={todos}
          linkToPath="_id"
          listTextPath="data.action"
          listSubTextPath="data.description"
          baseUrl={`/quick-space/todo/${detailId}`}
          listAction={(id, object) => {
            return (
              <context.UI.Field
                modelId="qs-todo"
                fieldId="done"
                objectId={id}
                object={object}
                mode="free"
                directSave
                directSaveDelay={1}
              />
            );
          }}
        />
      </Grid>

      {doneTodos && doneTodos.length > 0 && (
        <Grid item xs={12} md={4}>
          <Paper className="paper">
            <Typography variant="h6">Done</Typography>
            <context.UI.Layouts.SortableList
              listItems={doneTodos}
              linkToPath="_id"
              listTextPath="data.action"
              baseUrl={`/quick-space/todo/${detailId}`}
              listSubTextPath="data.description"
              listAction={(id, object) => {
                return (
                  <context.UI.Field
                    modelId="qs-todo"
                    fieldId="done"
                    objectId={id}
                    object={object}
                    mode="free"
                    directSave
                    directSaveDelay={1}
                  />
                );
              }}
            />
          </Paper>
        </Grid>
      )}
    </Grid>
  );
};

export default AppQSActionTodoDetail;

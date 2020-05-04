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
  const [model, setModel] = useState();

  // Lifecycle
  useEffect(() => {
    const todoRequest = context.getObjects(
      "qs-todo",
      { "data.project": detailId },
      (response) => {
        if (response.success) {
          setTodos(
            sortBy(
              filter(response.data, (o) => {
                return o.data.done !== true;
              }),
              ["data.order"]
            )
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

    const modelRequest = context.getModel("qs-todo", (response) => {
      if (response.success) {
        setModel(response.data);
      } else {
        console.log(response);
      }
    });

    return () => {
      todoRequest.stop();
      modelRequest.stop();
    };
  }, [detailId]);

  // UI
  if (!todos || !model) return <context.UI.Loading />;
  return (
    <context.UI.Animations.AnimationContainer>
      <Grid container>
        <Grid item xs={12} md={8}>
          <context.UI.Animations.AnimationItem>
            <Paper className="paper">
              <TextField
                fullWidth
                margin="normal"
                label="Add todo"
                value={newTodo}
                style={{ margin: "0 15px", width: "95%" }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    context
                      .addObject("qs-todo", {
                        action: newTodo,
                        project: detailId,
                      })
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
                onListItemClick={(object) => {
                  context.setDialog({
                    display: true,
                    title: object.data.action,
                    content: (
                      <context.UI.Layouts.ObjectLayout
                        model={model}
                        layoutId="popup"
                        appId="quick-space"
                        objectId={object._id}
                      />
                    ),
                  });
                }}
                listAction={(id, object) => {
                  return (
                    <context.UI.Field
                      field={model.fields["done"]}
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
          </context.UI.Animations.AnimationItem>
        </Grid>

        {doneTodos && doneTodos.length > 0 && (
          <Grid item xs={12} md={4} style={{ padding: 15 }}>
            <context.UI.Animations.AnimationItem>
              <Typography variant="h6">Done</Typography>
              <context.UI.Layouts.SortableList
                listItems={doneTodos}
                linkToPath="_id"
                listTextPath="data.action"
                baseUrl={`/quick-space/todo/${detailId}`}
                listSubTextPath="data.description"
                onListItemClick={(object) => {
                  context.setDialog({
                    display: true,
                    title: object.data.action,
                    content: (
                      <context.UI.Layouts.ObjectLayout
                        model={model}
                        layoutId="default"
                        appId="quick-space"
                        objectId={object._id}
                      />
                    ),
                  });
                }}
                listAction={(id, object) => {
                  return (
                    <context.UI.Field
                      field={model.fields["done"]}
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
            </context.UI.Animations.AnimationItem>
          </Grid>
        )}
      </Grid>
    </context.UI.Animations.AnimationContainer>
  );
};

export default AppQSActionTodoDetail;

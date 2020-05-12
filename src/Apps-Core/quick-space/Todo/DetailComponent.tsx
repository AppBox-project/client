import React, { useState, useEffect } from "react";
import { AppContextType } from "../../../Utils/Types";
import { filter, sortBy } from "lodash";
import {
  Grid,
  Paper,
  Typography,
  TextField,
  IconButton,
  Tooltip,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Divider,
} from "@material-ui/core";
import { FaTrello, FaBars, FaExpand, FaAngleDown } from "react-icons/fa";

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
  const [view, setView] = useState("todo");

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

  useEffect(() => {
    context.setButton("toggleMode", {
      icon: view === "todo" ? <FaTrello /> : <FaBars />,
      function: () => {
        setView(view === "todo" ? "board" : "todo");
      },
    });

    // On unmount
    return () => {
      context.setButton("toggleMode", undefined);
    };
  }, [view, detailId]);

  // UI
  if (!todos || !model) return <context.UI.Loading />;
  return (
    <>
      {view === "board" && (
        <context.UI.Layouts.Object.BoardLayout
          context={context}
          objects={todos}
          model={model}
          boardField="status"
          onItemClick={(object) => {
            context.setDialog({
              display: true,
              size: "md",
              title: object.data.action,
              content: (
                <context.UI.Layouts.Object.ObjectLayout
                  model={model}
                  layoutId="popup"
                  appId="quick-space"
                  objectId={object._id}
                />
              ),
            });
          }}
        />
      )}
      {view === "todo" && (
        <context.UI.Animations.AnimationContainer>
          <Grid container>
            <Grid
              item
              xs={12}
              md={8}
              style={{ padding: 15, boxSizing: "border-box" }}
            >
              <context.UI.Animations.AnimationItem>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Add todo"
                  value={newTodo}
                  style={{ margin: "0 15px", width: "95%" }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      context.addObject(
                        "qs-todo",
                        {
                          action: newTodo,
                          project: detailId,
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
                  listItems={todos}
                  linkToPath="_id"
                  listTextPath="data.action"
                  listSubTextPath="data.description"
                  baseUrl={`/quick-space/todo/${detailId}`}
                  onListItemClick={(object) => {
                    context.setDialog({
                      display: true,
                      size: "md",
                      title: object.data.action,
                      content: (
                        <context.UI.Layouts.Object.ObjectLayout
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
              </context.UI.Animations.AnimationItem>
            </Grid>

            {doneTodos && doneTodos.length > 0 && (
              <Grid item xs={12} md={4} style={{ padding: 15 }}>
                <context.UI.Animations.AnimationItem>
                  <ExpansionPanel>
                    <ExpansionPanelSummary
                      expandIcon={<FaAngleDown />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography variant="h6">Done</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
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
                              <context.UI.Layouts.Object.ObjectLayout
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
                      />{" "}
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                </context.UI.Animations.AnimationItem>
              </Grid>
            )}
          </Grid>
        </context.UI.Animations.AnimationContainer>
      )}
    </>
  );
};

export default AppQSActionTodoDetail;

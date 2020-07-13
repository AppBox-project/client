import React, { useState, useEffect, useGlobal } from "reactn";
import { AppContextType } from "../../../Utils/Types";
import { filter, sortBy, find } from "lodash";
import {
  Grid,
  Typography,
  TextField,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  ListSubheader,
  List,
} from "@material-ui/core";
import { FaTrello, FaBars, FaAngleDown } from "react-icons/fa";
import AppQSActionTodoDetailTodo from "./Todo";
import { useHistory } from "react-router-dom";

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
  const [todos, setTodos] = useState<any>();
  const [allTodos, setAllTodos] = useState<any>();
  const [doneTodos, setDoneTodos] = useState<any>();
  const [subTodos, setSubTodos] = useState<any>();
  const [newTodo, setNewTodo] = useState<any>("");
  const [model, setModel] = useState<any>();
  const [displayTodo, setDisplayTodo] = useState<any>(undefined);
  const [view, setView] = useState<any>("todo");
  const [isMobile] = useGlobal<any>("isMobile");
  const history = useHistory();

  // Lifecycle
  useEffect(() => {
    const todoRequest = context.getObjects(
      "qs-todo",
      { "data.project": detailId, "data.owner": context.user._id },
      (response) => {
        if (response.success) {
          setAllTodos(response.data);
          setTodos(
            sortBy(
              filter(response.data, (o) => {
                return o.data.done !== true && !o.data.belongs_to;
              }),
              ["data.order"]
            )
          );
          setDoneTodos(
            sortBy(
              filter(response.data, (o) => {
                return o.data.done === true;
              }),
              ["data.order"]
            )
          );
          setSubTodos(
            sortBy(
              filter(response.data, (o) => {
                return o.data.belongs_to;
              }),
              ["data.order"]
            )
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
  }, [detailId, context]);

  useEffect(() => {
    if (window.location.href.match("#") && allTodos && model) {
      // We came here via an /o/ link
      setDisplayTodo(
        find(allTodos, (o) => o._id === window.location.href.split("#")[1])
      );
    }
  }, [model, allTodos]);

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

  // Display todo
  useEffect(() => {
    if (displayTodo) {
      console.log(model);

      context?.setDialog({
        display: true,
        size: "md",
        title: displayTodo.data.action,
        onClose: () => {
          history.push(window.location.pathname.split("#")[0]);
        },

        content: (
          <context.UI.Layouts.Object.ObjectLayout
            model={model}
            layoutId="popup"
            popup
            appId="quick-space"
            objectId={displayTodo._id}
          />
        ),
      });
    }
  }, [displayTodo]);

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
          customItem={(todo) => {
            return (
              <Grid container>
                <Grid item xs={3}>
                  <context.UI.Field
                    field={model.fields["done"]}
                    fieldId="done"
                    objectId={todo._id}
                    object={todo}
                    mode="free"
                    directSave
                    directSaveDelay={1}
                  />
                </Grid>
                <Grid
                  item
                  xs={9}
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
                          appId="quick-space"
                          objectId={todo._id}
                        />
                      ),
                    });
                  }}
                >
                  <Typography variant="body1">{todo.data.action}</Typography>
                  <Typography variant="caption">
                    {todo.data.description}
                  </Typography>
                </Grid>
              </Grid>
            );
          }}
        />
      )}
      {view === "todo" && (
        <List>
          <context.UI.Animations.AnimationContainer>
            <Grid container>
              <Grid
                item
                xs={12}
                md={8}
                style={{ padding: 15, boxSizing: "border-box" }}
              >
                <context.UI.Animations.AnimationItem>
                  <ListSubheader style={{ backgroundColor: "white" }}>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Add todo"
                      value={newTodo}
                      style={{ margin: "0 15px", width: "98%" }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          context.addObject(
                            "qs-todo",
                            {
                              action: newTodo,
                              project: detailId,
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
                  </ListSubheader>
                  <context.UI.Layouts.SortableList
                    listItems={todos}
                    linkToPath="_id"
                    baseUrl={`/quick-space/todo/${detailId}`}
                    customItem={(todo) => (
                      <AppQSActionTodoDetailTodo
                        subTodos={subTodos}
                        todo={todo}
                        context={context}
                        model={model}
                        isMobile={isMobile}
                        level={1}
                        projectId={detailId}
                      />
                    )}
                  />
                </context.UI.Animations.AnimationItem>
              </Grid>

              {doneTodos && doneTodos.length > 0 && (
                <Grid item xs={12} md={4} style={{ padding: 15 }}>
                  <context.UI.Animations.AnimationItem>
                    <ExpansionPanel TransitionProps={{ unmountOnExit: true }}>
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
                                  popup
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
        </List>
      )}
    </>
  );
};

export default AppQSActionTodoDetail;

import React, { useState, useEffect } from "react";
import {
  AppContextType,
  ModelType,
  ValueListItemType,
} from "../../../Utils/Types";
import { AppTodoType, AppProjectType, AppTagType } from "../Types";
import {
  Grid,
  List,
  ListSubheader,
  Divider,
  Collapse,
  Button,
  Typography,
} from "@material-ui/core";
import AppQSActionTodoDetailTodo from "./Todo";
import { FaToggleOn, FaToggleOff } from "react-icons/fa";
import { filter } from "lodash";

const AppQSTodoListLayout: React.FC<{
  context: AppContextType;
  todos: AppTodoType[];
  project: AppProjectType;
  model: ModelType;
  isMobile: boolean;
}> = ({ context, todos, project, model, isMobile }) => {
  // Vars
  const [doneTodos, setDoneTodos] = useState<AppTodoType[]>();
  const [unfinishedTodos, setUnfinishedTodos] = useState<AppTodoType[]>();
  const [newTodo, setNewTodo] = useState<string>("");
  const [showDone, setShowDone] = useState<boolean>(false);
  const [tagList, setTagList] = useState<ValueListItemType[]>([]);
  const [statusses, setStatusses] = useState<ValueListItemType[]>([]);
  const [activeTagFilters, setActiveTagFilters] = useState<ValueListItemType[]>(
    []
  );
  const [activeStatusFilters, setActiveStatusFilters] = useState<
    ValueListItemType[]
  >([]);
  const [filteredTodos, setFilteredTodos] = useState<AppTodoType[]>();

  // Lifecycle
  // -> In case model changes
  useEffect(() => {
    const ns: ValueListItemType[] = [];
    (model?.fields?.status?.typeArgs?.options || []).map((s) =>
      ns.push({ label: s.label, value: s.key })
    );
    setStatusses(ns);
  }, [model]);
  // -> For todos
  useEffect(() => {
    const newDT = [];
    const newUT = [];
    (todos || []).map((t: AppTodoType) => {
      if (t.data.done) {
        newDT.push(t);
      } else {
        newUT.push(t);
      }
    });

    setDoneTodos(newDT);
    setUnfinishedTodos(newUT);
  }, [todos]);

  // -> Lifecycle of a filter
  useEffect(() => {
    let nt: AppTodoType[] = [];

    // Tags
    if ((activeTagFilters || []).length > 0) {
      (unfinishedTodos || []).map((t: AppTodoType) => {
        let show = false;
        (activeTagFilters || []).map((tf) => {
          if ((t.data.tags || []).includes(tf.value)) {
            show = true;
          }
        });

        if (show) {
          nt.push(t);
        }
      });
    } else {
      nt = unfinishedTodos;
    }

    // Status
    let nnt: AppTodoType[] = [];
    if ((activeStatusFilters || []).length > 0) {
      nt.map((t: AppTodoType) => {
        let show = false;
        activeStatusFilters.map((f) => {
          if (t.data.status === f.value) show = true;
        });
        if (show) nnt.push(t);
      });
    } else {
      nnt = nt;
    }

    setFilteredTodos(nnt);
  }, [activeStatusFilters, activeTagFilters, unfinishedTodos]);

  // -> For project
  useEffect(() => {
    const request = context.getObjects(
      "qs-tags",
      { "data.show_in_todos": { $ne: false } },
      (response) => {
        if (response.success) {
          const tl: ValueListItemType[] = [];
          response.data.map((r: AppTagType) =>
            tl.push({ label: r.data.name, value: r._id })
          );
          setTagList(tl);
        } else {
          console.log(response);
        }
      }
    );

    return () => {
      request.stop();
    };
  }, [project]);

  // UI
  return (
    <Grid container>
      <Grid item xs={12} md={8} className={!isMobile && "scrollIndependently"}>
        <context.UI.Design.Card
          title={`${project.data.name}${
            filteredTodos && ` (${filteredTodos?.length})`
          }`}
          titleDivider
          titleInPrimaryColor
          centerTitle
          withBigMargin
        >
          <List style={{ paddingTop: 0, marginTop: 0 }}>
            <ListSubheader
              style={{
                padding: "15px 0",
                zIndex: 102,
              }}
            >
              <context.UI.Inputs.TextInput
                label="New todo"
                autoFocus={!isMobile}
                noLabel
                value={newTodo}
                onChange={(value) => setNewTodo(value)}
                onEnter={() => {
                  context.addObject(
                    "qs-todo",
                    {
                      action: newTodo,
                      owner: context.user._id,
                      project: project._id,
                    },
                    (response) => {
                      if (response.success) {
                      } else {
                        console.log(response);
                      }
                    }
                  );
                  setNewTodo("");
                }}
                onEscape={() => {
                  setNewTodo("");
                }}
              />
            </ListSubheader>
            <Divider />
            <Grid container spacing={2} style={{ margin: "10px 0 10px -8px" }}>
              <Grid item xs={6}>
                <context.UI.Inputs.Select
                  label="Filter tags..."
                  options={tagList}
                  multiple
                  value={activeTagFilters}
                  onChange={(value) => setActiveTagFilters(value)}
                />
              </Grid>
              <Grid item xs={6}>
                <context.UI.Inputs.Select
                  label="Filter status..."
                  options={statusses}
                  value={activeStatusFilters}
                  onChange={(value) => setActiveStatusFilters(value)}
                  multiple
                />
              </Grid>
            </Grid>

            <Divider />
            {(filteredTodos || []).map(
              (todo: AppTodoType) =>
                !todo.data.belongs_to && (
                  <AppQSActionTodoDetailTodo
                    todo={todo}
                    context={context}
                    model={model}
                    isMobile={isMobile}
                    key={todo._id}
                    subTodos={filter(
                      unfinishedTodos,
                      (t: AppTodoType) => t.data.belongs_to === todo._id
                    )}
                    allTodos={unfinishedTodos}
                    level={1}
                  />
                )
            )}
          </List>
        </context.UI.Design.Card>
      </Grid>
      {(doneTodos || []).length > 0 && (
        <Grid item xs={12} md={4}>
          <div style={{ paddingBottom: isMobile && 60 }}>
            <context.UI.Design.Card
              title="Done!"
              withBigMargin
              centerTitle
              titleDivider
              titleInPrimaryColor
            >
              <Button
                onClick={() => {
                  setShowDone(!showDone);
                }}
                fullWidth
                startIcon={showDone ? <FaToggleOn /> : <FaToggleOff />}
                variant={showDone ? "outlined" : "text"}
                color="primary"
              >
                Show done
              </Button>
              <Collapse in={showDone} timeout="auto" unmountOnExit>
                <List>
                  {(doneTodos || []).map((todo) => (
                    <AppQSActionTodoDetailTodo
                      todo={todo}
                      context={context}
                      model={model}
                      isMobile={isMobile}
                      key={todo._id}
                      hideStatus
                    />
                  ))}
                </List>
              </Collapse>
            </context.UI.Design.Card>
          </div>
        </Grid>
      )}
    </Grid>
  );
};

export default AppQSTodoListLayout;

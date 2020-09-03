import React, { useState, useEffect } from "react";
import { AppContextType, ModelType } from "../../../Utils/Types";
import { AppTodoType, AppProjectType } from "../Types";
import {
  Grid,
  List,
  ListSubheader,
  Divider,
  Collapse,
  IconButton,
  Button,
} from "@material-ui/core";
import AppQSActionTodoDetailTodo from "./Todo";
import { FaToggleOn, FaToggleOff } from "react-icons/fa";

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

  // Lifecycle
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

  // UI
  return (
    <context.UI.Animations.AnimationContainer>
      <Grid container>
        <Grid item xs={12} md={8}>
          <context.UI.Animations.AnimationItem>
            <context.UI.Design.Card
              title={project.data.name}
              titleDivider
              titleInPrimaryColor
              centerTitle
              withBigMargin
            >
              <List>
                <ListSubheader>
                  <context.UI.Inputs.TextInput
                    label="New todo"
                    autoFocus
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
                {(unfinishedTodos || []).map((todo) => (
                  <AppQSActionTodoDetailTodo
                    todo={todo}
                    context={context}
                    model={model}
                    isMobile={isMobile}
                    key={todo._id}
                  />
                ))}
              </List>
            </context.UI.Design.Card>
          </context.UI.Animations.AnimationItem>
        </Grid>
        <Grid item xs={12} md={4}>
          <context.UI.Animations.AnimationItem>
            <context.UI.Design.Card
              title="Todo"
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
                    />
                  ))}
                </List>
              </Collapse>
            </context.UI.Design.Card>
          </context.UI.Animations.AnimationItem>
        </Grid>
      </Grid>
    </context.UI.Animations.AnimationContainer>
  );
};

export default AppQSTodoListLayout;

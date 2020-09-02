import React from "react";
import { AppContextType, ModelType } from "../../../Utils/Types";
import { AppTodoType, AppProjectType } from "../Types";
import { Grid, List } from "@material-ui/core";
import AppQSActionTodoDetailTodo from "./Todo";

const AppQSTodoListLayout: React.FC<{
  context: AppContextType;
  todos: AppTodoType[];
  project: AppProjectType;
  model: ModelType;
  isMobile: boolean;
}> = ({ context, todos, project, model, isMobile }) => {
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
                {(todos || []).map((todo) => (
                  <AppQSActionTodoDetailTodo
                    todo={todo}
                    context={context}
                    model={model}
                    isMobile={isMobile}
                  />
                ))}
              </List>
            </context.UI.Design.Card>
          </context.UI.Animations.AnimationItem>
        </Grid>
        <Grid item xs={12} md={4}>
          <context.UI.Animations.AnimationItem>
            <context.UI.Design.Card title="Todo" withBigMargin>
              Test
            </context.UI.Design.Card>
          </context.UI.Animations.AnimationItem>
        </Grid>
      </Grid>
    </context.UI.Animations.AnimationContainer>
  );
};

export default AppQSTodoListLayout;

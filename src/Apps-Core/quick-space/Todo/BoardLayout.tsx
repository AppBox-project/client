import React from "react";
import { AppContextType, ModelType } from "../../../Utils/Types";
import { AppTodoType, AppProjectType } from "../Types";
import AppQSActionTodoDetailTodo from "./Todo";

const AppQSTodoBoardLayout: React.FC<{
  context: AppContextType;
  todos: AppTodoType[];
  project: AppProjectType;
  model: ModelType;
  isMobile: boolean;
}> = ({ context, todos, model, isMobile }) => {
  return (
    <context.UI.Layouts.Object.BoardLayout
      context={context}
      objects={todos}
      model={model}
      boardField="status"
      customItem={(todo) => (
        <AppQSActionTodoDetailTodo
          todo={todo}
          context={context}
          model={model}
          isMobile={isMobile}
          hideStatus
        />
      )}
    />
  );
};

export default AppQSTodoBoardLayout;

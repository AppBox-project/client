import React, { useState, useEffect, useGlobal } from "reactn";
import { AppContextType, ModelType } from "../../../Utils/Types";
import { FaTrello, FaList } from "react-icons/fa";
import { AppProjectType, AppTodoType } from "../Types";
import { Skeleton } from "@material-ui/lab";
import AppQSTodoListLayout from "./ListLayout";
import AppQSTodoBoardLayout from "./BoardLayout";

const AppQSActionTodoDetail: React.FC<{
  context: AppContextType;
  match: { params: { detailId } };
  projects: {
    [key: string]: AppProjectType;
  };
}> = ({
  context,
  match: {
    params: { detailId },
  },
  projects,
}) => {
  // Vars
  const [project, setProject] = useState<AppProjectType>();
  const [view, setView] = useState<"List" | "Board">("List");
  const [todos, setTodos] = useState<AppTodoType[]>();
  const [model, setModel] = useState<ModelType>();
  const [isMobile] = useGlobal<any>("isMobile");

  // Lifecycle
  // -> Lifecycle
  useEffect(() => {
    const listener = context.getModel("qs-todo", (response) => {
      if (response.success) {
        setModel(response.data);
      } else {
        console.log(response);
      }
    });

    return () => listener.stop();
  }, []);

  // -> Project variable
  useEffect(() => {
    if (projects) setProject(projects[detailId]);
  }, [projects, detailId]);

  // -> Load todos
  useEffect(() => {
    const listener = context.getObjects(
      "qs-todo",
      { "data.project": detailId, "data.owner": context.user._id },
      (response) => {
        if (response.success) {
          setTodos(response.data);
        } else {
          console.log(response);
        }
      }
    );

    return () => listener.stop();
  }, [detailId]);

  // -> Change view
  useEffect(() => {
    context.setButton("toggleMode", {
      icon: view === "List" ? <FaTrello /> : <FaList />,
      function: () => {
        setView(view === "List" ? "Board" : "List");
      },
    });

    // On unmount
    return () => {
      context.setButton("toggleMode", undefined);
    };
  }, [view, detailId]);

  // UI
  if (!project || !model) return <Skeleton />;
  return view === "List" ? (
    <AppQSTodoListLayout
      context={context}
      todos={todos}
      project={project}
      model={model}
      isMobile={isMobile}
    />
  ) : (
    <AppQSTodoBoardLayout
      context={context}
      todos={todos}
      project={project}
      model={model}
      isMobile={isMobile}
    />
  );
};

export default AppQSActionTodoDetail;

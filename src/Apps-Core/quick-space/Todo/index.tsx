import React, { useState, useEffect } from "react";
import { AppContextType, ListItemType } from "../../../Utils/Types";
import AppQSActionTodoDetail from "./DetailComponent";
import array2dTo3d from "../../../Utils/Functions/array2dTo3d";
import { AppProjectType } from "../Types";

const AppQSActionTodo: React.FC<{
  match: { isExact: boolean };
  context: AppContextType;
  action: string;
}> = ({ context, action, match: { isExact } }) => {
  // Vars
  const [projects, setProjects] = useState<ListItemType[]>();
  const [flatProjects, setFlatProjects] = useState<{
    [key: string]: AppProjectType;
  }>();

  // Lifecycle
  useEffect(() => {
    const projectRequest = context.getObjects(
      "qs-project",
      { "data.owner": context.user._id, "data.show_in_todos": { $ne: false } },
      (response) => {
        if (response.success) {
          setProjects(
            array2dTo3d(response.data, "data.parent", true, "data.name")
          );
          const newFP = {};
          response.data.map((o: AppProjectType) => (newFP[o._id] = o));
          setFlatProjects(newFP);
        } else {
          console.log(response);
        }
      }
    );
    return () => {
      projectRequest.stop();
    };
  }, []);

  // UI
  if (!projects) return <context.UI.Loading />;

  return (
    <context.UI.Layouts.ListDetailLayout
      context={context}
      baseUrl="/quick-space/todo"
      list={projects}
      navWidth={2}
      DetailComponent={AppQSActionTodoDetail}
      detailComponentProps={{ projects: flatProjects }}
      style={{ paddingBottom: 50 }}
      title="Todos"
    />
  );
};

export default AppQSActionTodo;

import React, { useState, useEffect } from "react";
import { AppContextType } from "../../../Utils/Types";
import AppQSActionTodoDetail from "./DetailComponent";
import { filter } from "lodash";

const AppQSActionTodo: React.FC<{
  match: { isExact: boolean };
  context: AppContextType;
  action: string;
}> = ({ context, action, match: { isExact } }) => {
  // Vars
  const [projects, setProjects] = useState();

  // Lifecycle
  useEffect(() => {
    const projectRequest = context.getObjects("qs-project", {}, (response) => {
      if (response.success) {
        const newProjects = [];
        response.data.map((project) => {
          if (!project.data.parent) {
            const subprojects = [];
            filter(response.data, (o) => {
              return o.data.parent === project._id;
            }).map((subProject) => {
              subprojects.push({
                id: subProject._id,
                label: subProject.data.name,
              });
            });
            newProjects.push({
              id: project._id,
              label: project.data.name,
              subItems: subprojects,
            });
          }
        });
        //@ts-ignore
        setProjects(newProjects);
      } else {
        console.log(response);
      }
    });
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
    />
  );
};

export default AppQSActionTodo;
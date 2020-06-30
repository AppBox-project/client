import React, { useState, useEffect } from "react";
import { AppContextType } from "../../../Utils/Types";
import AppQSActionTodoDetail from "./DetailComponent";
import { filter } from "lodash";
import { GoTasklist } from "react-icons/go";

const AppQSActionTodo: React.FC<{
  match: { isExact: boolean };
  context: AppContextType;
  action: string;
}> = ({ context, action, match: { isExact } }) => {
  // Vars
  const [projects, setProjects] = useState<any>();

  // Lifecycle
  useEffect(() => {
    const projectRequest = context.getObjects(
      "qs-project",
      { "data.owner": context.user._id },
      (response) => {
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
      navFixedIcon={<GoTasklist />}
      navWidth={3}
      DetailComponent={AppQSActionTodoDetail}
    />
  );
};

export default AppQSActionTodo;

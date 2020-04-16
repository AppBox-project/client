import React, { useState, useEffect, useGlobal } from "reactn";
import { AppContextType } from "../../../Utils/Types";
import { TreeView, TreeItem } from "@material-ui/lab";
import { filter } from "lodash";
import AppQSNotesDetail from "./NotesDetail";
import AppQSNotesNavigation from "./Navigation";
import { FaStickyNote, FaProjectDiagram, FaTasks } from "react-icons/fa";

const AppQSActionNotes: React.FC<{
  match: { isExact: boolean };
  context: AppContextType;
  action: string;
}> = ({ context, action, match: { isExact } }) => {
  // Vars
  const [projects, setProjects] = useState();
  const [isMobile] = useGlobal<any>("isMobile");

  // Lifecycle
  useEffect(() => {
    context.getObjects("qs-project", {}, (projectResponse) => {
      context.getObjects("qs-memo", {}, (memoResponse) => {
        if (projectResponse.success) {
          if (memoResponse.success) {
            // Map projects for treeview
            const newProjects = [];
            projectResponse.data.map((project) => {
              if (!project.data.parent) {
                const subItems = [];
                // Subprojects
                filter(projectResponse.data, (o) => {
                  return o.data.parent === project._id;
                }).map((subProject) => {
                  // Subprojects memos
                  const subMemos = [];
                  filter(memoResponse.data, (o) => {
                    return o.data.project === subProject._id;
                  }).map((subMemo) => {
                    subMemos.push({
                      key: subMemo._id,
                      label: subMemo.data.title,
                      icon: FaStickyNote,
                    });
                  });

                  subItems.push({
                    key: subProject._id,
                    label: subProject.data.name,
                    icon: FaTasks,
                    subItems: subMemos.length > 0 ? subMemos : undefined,
                  });
                });
                // Submemos
                filter(memoResponse.data, (o) => {
                  return o.data.project === project._id;
                }).map((subProject) => {
                  subItems.push({
                    key: subProject._id,
                    label: subProject.data.title,
                    icon: FaStickyNote,
                  });
                });

                newProjects.push({
                  value: project._id,
                  label: project.data.name,
                  subItems,
                });
              }
            });
            setProjects(newProjects);
          } else {
            console.log(memoResponse);
          }
        } else {
          console.log(projectResponse);
        }
      });
    });
  }, []);

  // UI
  if (!projects) return <context.UI.Loading />;

  return (
    <context.UI.ListDetailLayout
      baseUrl="quick-space/notes"
      customNavComponent={
        <AppQSNotesNavigation context={context} projects={projects} />
      }
      DetailComponent={AppQSNotesDetail}
      context={context}
    />
  );
};

export default AppQSActionNotes;
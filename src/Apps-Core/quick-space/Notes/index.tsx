import React, { useState, useEffect, useGlobal } from "reactn";
import { AppContextType } from "../../../Utils/Types";
import { filter, sortBy } from "lodash";
import AppQSNotesNavigation from "./Navigation";
import { Grid } from "@material-ui/core";
import { Route } from "react-router-dom";
import AppQSNotesDetail from "./NotesDetail";

const AppQSActionNotes: React.FC<{
  match: { isExact: boolean };
  context: AppContextType;
  action: string;
}> = ({ context, action, match: { isExact } }) => {
  //Vars
  const [projects, setProjects] = useState<any>();
  const [flatProjects, setFlatProjects] = useState<any>();
  const [memos, setMemos] = useState<any>();
  const [selectedMemo, setSelectedMemo] = useState<any>();

  // Lifecycle
  useEffect(() => {
    context.getObjects(
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
                  value: subProject._id,
                  label: subProject.data.name,
                });
              });
              newProjects.push({
                value: project._id,
                label: project.data.name,
                subprojects,
              });
            }
          });
          //@ts-ignore
          setProjects(newProjects);
          setFlatProjects(response.data);
        } else {
          console.log(response);
        }
      }
    );

    context.getObjects("qs-note", {}, (response) => {
      if (response.success) {
        setMemos(sortBy(response.data, ["data.order"]));
      } else {
        console.log(response);
      }
    });
  }, []);

  // UI

  if (!projects || !memos) return <context.UI.Loading />;
  return (
    <context.UI.Layouts.ListDetailLayout
      navWidth={5}
      customNavComponent={
        <AppQSNotesNavigation
          memos={memos}
          flatProjects={flatProjects}
          projects={projects}
          context={context}
          selectedMemo={selectedMemo}
        />
      }
      context={context}
      baseUrl="/quick-space/notes"
      DetailComponent={AppQSNotesDetail}
      detailComponentProps={{
        setSelectedMemo: setSelectedMemo,
        context: context,
      }}
    />
  );
};
export default AppQSActionNotes;

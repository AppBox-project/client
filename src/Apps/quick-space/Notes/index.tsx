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
  const [projects, setProjects] = useState();
  const [flatProjects, setFlatProjects] = useState();
  const [memos, setMemos] = useState();
  const [selectedMemo, setSelectedMemo] = useState();

  // Lifecycle
  useEffect(() => {
    context.getObjects("qs-project", {}, (response) => {
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
    });

    context.getObjects("qs-memo", {}, (response) => {
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
    <Grid container>
      <Grid item xs={12} md={6} lg={4}>
        <AppQSNotesNavigation
          memos={memos}
          flatProjects={flatProjects}
          projects={projects}
          context={context}
          selectedMemo={selectedMemo}
        />
      </Grid>
      <Grid item xs={12} md={6} lg={8}>
        <Route
          path="/quick-space/notes/:noteId"
          render={(props) => {
            return (
              <AppQSNotesDetail
                {...props}
                setSelectedMemo={setSelectedMemo}
                context={context}
              />
            );
          }}
        />
      </Grid>
    </Grid>
  );
};

export default AppQSActionNotes;

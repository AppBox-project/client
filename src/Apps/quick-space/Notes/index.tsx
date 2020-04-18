import React, { useState, useEffect, useGlobal } from "reactn";
import { AppContextType } from "../../../Utils/Types";
import { TreeView, TreeItem } from "@material-ui/lab";
import { filter } from "lodash";
import AppQSNotesNavigation from "./Navigation";
import { Grid } from "@material-ui/core";

const AppQSActionNotes: React.FC<{
  match: { isExact: boolean };
  context: AppContextType;
  action: string;
}> = ({ context, action, match: { isExact } }) => {
  //Vars
  const [projects, setProjects] = useState();
  const [flatProjects, setFlatProjects] = useState();
  const [memos, setMemos] = useState();

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
        setMemos(response.data);
      } else {
        console.log(response);
      }
    });
  }, []);

  // UI

  if (!projects || !memos) return <context.UI.Loading />;
  return (
    <Grid container>
      <Grid item xs={5}>
        <AppQSNotesNavigation
          memos={memos}
          flatProjects={flatProjects}
          projects={projects}
          context={context}
        />
      </Grid>
    </Grid>
  );
};

export default AppQSActionNotes;

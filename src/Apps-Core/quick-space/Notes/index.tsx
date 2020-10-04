import React, { useState, useEffect, useGlobal } from "reactn";
import { AppContextType, ModelType } from "../../../Utils/Types";
import AppQSNotesDetail from "./NotesDetail";
import array2dTo3d from "../../../Utils/Functions/array2dTo3d";
import { AppProjectType } from "../Types";
import { List, ListItem, ListItemText } from "@material-ui/core";
import { useHistory } from "react-router-dom";

const AppQSActionNotes: React.FC<{
  match: { isExact: boolean };
  context: AppContextType;
  action: string;
}> = ({ context, action, match: { isExact } }) => {
  //Vars
  const [projects, setProjects] = useState<any>();
  const [sharedProjects, setSharedProjects] = useState<AppProjectType[]>();
  const [flatProjects, setFlatProjects] = useState<{}>();
  const [isMobile] = useGlobal<any>("isMobile");
  const [model, setModel] = useState<ModelType>();
  const history = useHistory();

  // Lifecycle
  useEffect(() => {
    const newFlat = {};

    const objectRequest = context.getObjects(
      "qs-project",
      {
        "data.owner": context.user._id,
        "data.show_in_notes": { $ne: false },
        "data.active": { $ne: false },
      },
      (response) => {
        if (response.success) {
          response.data.map((o: AppProjectType) => (newFlat[o._id] = o));
          setFlatProjects(newFlat);
          setProjects(
            array2dTo3d(response.data, "data.parent", true, "data.name", [
              "data.order",
            ])
          );
        } else {
          console.log(response);
        }
      }
    );

    // Shared with me
    const sharedProjectRequest = context.getObjects(
      "qs-project",
      {
        "data.shared_with": { $all: [context.user._id] },
        "data.show_in_notes": { $ne: false },
        "data.active": { $ne: false },
      },
      (response) => {
        if (response.success) {
          setSharedProjects(response.data);
          response.data.map((o: AppProjectType) => (newFlat[o._id] = o));
          setFlatProjects(newFlat);
        } else {
          console.log(response);
        }
      }
    );
    const modelRequest = context.getModel("qs-note", (response) => {
      if (response.success) {
        setModel(response.data);
      } else {
        console.log(response);
      }
    });

    return () => {
      objectRequest.stop();
      modelRequest.stop();
      sharedProjectRequest.stop();
    };
  }, []);

  // UI

  if (!projects) return <context.UI.Loading />;
  return (
    <context.UI.Layouts.ListDetailLayout
      title="Projects"
      navWidth={2}
      list={projects}
      context={context}
      baseUrl="/quick-space/notes"
      DetailComponent={AppQSNotesDetail}
      detailComponentProps={{
        context: context,
        projects: flatProjects,
        isMobile,
        model,
      }}
      style={{ paddingBottom: isMobile && 50 }}
      footerComponent={
        (sharedProjects || []).length > 0 && (
          <context.UI.Design.Card
            withBigMargin
            disablePadding
            title="Shared with me"
            titleDivider
            titleInPrimaryColor
            centerTitle
          >
            <List>
              {sharedProjects.map((project: AppProjectType) => (
                <ListItem
                  button
                  onClick={() => {
                    history.push(`/quick-space/notes/${project._id}`);
                  }}
                >
                  <ListItemText>{project.data.name}</ListItemText>
                </ListItem>
              ))}
            </List>
          </context.UI.Design.Card>
        )
      }
    />
  );
};
export default AppQSActionNotes;

import React, { useState, useEffect } from "reactn";
import { AppContextType } from "../../../Utils/Types";
import AppQSNotesDetail from "./NotesDetail";
import array2dTo3d from "../../../Utils/Functions/array2dTo3d";
import { AppProjectType } from "../Types";

const AppQSActionNotes: React.FC<{
  match: { isExact: boolean };
  context: AppContextType;
  action: string;
}> = ({ context, action, match: { isExact } }) => {
  //Vars
  const [projects, setProjects] = useState<any>();
  const [flatProjects, setFlatProjects] = useState<{}>();

  // Lifecycle
  useEffect(() => {
    context.getObjects(
      "qs-project",
      { "data.owner": context.user._id, "data.show_in_notes": { $ne: false } },
      (response) => {
        if (response.success) {
          const newFlat = {};
          response.data.map((o: AppProjectType) => (newFlat[o._id] = o));
          setFlatProjects(newFlat);
          setProjects(
            array2dTo3d(response.data, "data.parent", true, "data.name")
          );
        } else {
          console.log(response);
        }
      }
    );
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
      }}
      style={{ paddingBottom: 50 }}
    />
  );
};
export default AppQSActionNotes;

import React, { useEffect } from "react";
import { AppContextType } from "../../../../Utils/Types";
import AppQSSettingsProjectDetail from "./Detail";
import { useState } from "reactn";
import { AppProjectType } from "../../Types";
import { ListItemType } from "../../../../Utils/Types";
import array2dTo3d from "../../../../Utils/Functions/array2dTo3d";

const AppSettingsProject: React.FC<{ context: AppContextType }> = ({
  context,
}) => {
  // Vars
  const [projects, setProjects] = useState<AppProjectType[]>([]);
  const [projectsList, setProjectsList] = useState<ListItemType[]>([]);

  // Lifecycle
  useEffect(() => {
    context.getObjects(
      "qs-project",
      { "data.owner": context.user._id },
      (response) => {
        if (response.success) {
          const pl = array2dTo3d(
            response.data,
            "data.parent",
            true,
            "data.name"
          );
          console.log(pl);

          setProjects(response.data);
          setProjectsList(pl);
        } else {
          console.log(response);
        }
      }
    );
  }, []);

  // UI
  return (
    <context.UI.Animations.AnimationContainer>
      <context.UI.Animations.AnimationItem>
        <context.UI.Layouts.ListDetailLayout
          baseUrl="/quick-space/settings/projects"
          DetailComponent={AppQSSettingsProjectDetail}
          context={context}
          list={projectsList}
          title="Projects"
          addFunction={() => {
            context.setDialog({
              display: true,
              title: "New project",
              content: (
                <context.UI.Layouts.Object.ObjectLayout
                  modelId="qs-project"
                  layoutId="create"
                  popup
                  context={context}
                  defaults={{ owner: context.user._id }}
                />
              ),
            });
          }}
          style={{ marginBottom: 64 }}
        />
      </context.UI.Animations.AnimationItem>
    </context.UI.Animations.AnimationContainer>
  );
};

export default AppSettingsProject;

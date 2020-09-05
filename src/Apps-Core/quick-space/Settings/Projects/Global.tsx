import React from "react";
import { AppContextType } from "../../../../Utils/Types";
import { AppProjectType } from "../../Types";
import { useState, useEffect } from "reactn";
import { map } from "lodash";
const AppQSSettingsProjectGlobal: React.FC<{
  context: AppContextType;
  projects: { [key: string]: AppProjectType };
  isMobile: boolean;
}> = ({ context, projects, isMobile }) => {
  // Vars
  const [projectList, setProjectList] = useState<any>([]);

  // Lifecycle
  useEffect(() => {
    const np = [];
    map(projects, (project) => np.push(project));
    setProjectList(np);
  }, [projects]);

  // UI
  return (
    <context.UI.Animations.AnimationContainer>
      <context.UI.Animations.AnimationItem>
        <context.UI.Design.Card title="Project settings" withBigMargin>
          Test
        </context.UI.Design.Card>
      </context.UI.Animations.AnimationItem>
      <context.UI.Animations.AnimationItem>
        <context.UI.Design.Card title="Project settings" withBigMargin>
          <context.UI.Layouts.SortableList
            baseUrl="/quick-space/settings/projects/settings"
            listItems={projectList}
            listTextPath="data.name"
          />
        </context.UI.Design.Card>
      </context.UI.Animations.AnimationItem>
    </context.UI.Animations.AnimationContainer>
  );
};

export default AppQSSettingsProjectGlobal;

import React, { useState } from "react";
import { find } from "lodash";
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from "@material-ui/core";
import { GiFlexibleStar } from "react-icons/gi";
import { AppContextType } from "../../../Utils/Types";

const AppQSNotesNavigation: React.FC<{ projects; context: AppContextType }> = ({
  projects,
  context,
}) => {
  const [project, selectProject] = useState();
  const [subproject, selectSubproject] = useState();

  return (
    <div style={{ padding: 15 }}>
      <context.UI.Forms.SelectInput
        label="Project"
        options={projects}
        onChange={(value) => {
          selectProject(value);
        }}
      />
      {project && (
        <context.UI.TreeView
          items={find(projects, (o) => o.value === project).subItems}
          linkTo={"/quick-space/notes"}
        />
      )}
    </div>
  );
};

export default AppQSNotesNavigation;

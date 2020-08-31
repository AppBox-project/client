import React from "react";
import { AppContextType } from "../../../../Utils/Types";
import { useState, useEffect } from "reactn";
import { AppProjectType } from "../../Types";

const AppQSSettingsProjectDetail: React.FC<{
  context: AppContextType;
  match: { params: { detailId } };
  projects: {};
}> = ({
  context,
  match: {
    params: { detailId },
  },
  projects,
}) => {
  // Vars
  const [project, setProject] = useState<AppProjectType>();

  // Lifecycle
  useEffect(() => {
    setProject(projects[detailId]);
  }, [detailId, projects]);

  // UI
  if (!project) return <context.UI.Loading />;
  return (
    <context.UI.Layouts.Object.ObjectLayout
      objectId={project._id}
      layoutId="settings"
      modelId="qs-project"
      context={context}
      baseUrl={`/quick-space/settings/projects/${detailId}`}
    />
  );
};

export default AppQSSettingsProjectDetail;

import React from "react";
import { AppContextType } from "../../../../Utils/Types";
import { useState, useEffect } from "reactn";
import { AppProjectType } from "../../Types";

const AppQSSettingsProjectDetail: React.FC<{
  context: AppContextType;
  match: { params: { detailId } };
  projects: {};
  isMobile: boolean;
}> = ({
  context,
  match: {
    params: { detailId },
  },
  projects,
  isMobile,
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
      style={{ paddingBottom: isMobile && 60 }}
    />
  );
};

export default AppQSSettingsProjectDetail;

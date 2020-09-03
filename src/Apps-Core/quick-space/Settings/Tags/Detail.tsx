import React from "react";
import { AppContextType } from "../../../../Utils/Types";
import { useState, useEffect } from "reactn";
import { AppTagType } from "../../Types";

const AppQSSettingsTagDetail: React.FC<{
  context: AppContextType;
  match: { params: { detailId } };
  tags: { [key: string]: AppTagType };
  isMobile;
}> = ({
  context,
  match: {
    params: { detailId },
  },
  tags,
  isMobile,
}) => {
  // Vars
  const [tag, setTag] = useState<AppTagType>();

  // Lifecycle
  useEffect(() => {
    setTag(tags[detailId]);
  }, [detailId, tags]);

  // UI
  if (!tag) return <context.UI.Loading />;
  return (
    <context.UI.Layouts.Object.ObjectLayout
      objectId={tag._id}
      layoutId="settings"
      modelId="qs-tags"
      context={context}
      baseUrl={`/quick-space/settings/tags/${detailId}`}
      style={{ paddingBottom: isMobile && 60 }}
    />
  );
};

export default AppQSSettingsTagDetail;

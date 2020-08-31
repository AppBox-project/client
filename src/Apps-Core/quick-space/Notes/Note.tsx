import React from "react";
import { AppContextType } from "../../../Utils/Types";
import { AppNoteType } from "../Types";

const AppQSNote: React.FC<{
  context: AppContextType;
  match: { params: { detailId } };
}> = ({
  context,
  match: {
    params: { detailId },
  },
}) => {
  return (
    <context.UI.Layouts.Object.ObjectLayout
      modelId="qs-note"
      objectId={detailId}
      layoutId="app"
      context={context}
      defaults={{ owner: context.user._id }}
    />
  );
};

export default AppQSNote;

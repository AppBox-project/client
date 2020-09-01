import React from "react";
import { AppContextType } from "../../../Utils/Types";
import { AppNoteType } from "../Types";
import { useEffect } from "reactn";

const AppQSNote: React.FC<{
  context: AppContextType;
  match: { params: { detailId } };
  notes;
}> = ({
  context,
  match: {
    params: { detailId },
  },
  notes,
}) => {
  // Lifecycle
  useEffect(() => {
    const img = (notes || {})[detailId]?.data?.image;
    if (img) context.setImage(img);
    return () => {
      context.setImage(undefined);
    };
  }, [detailId, notes]);

  return (
    <context.UI.Layouts.Object.ObjectLayout
      modelId="qs-note"
      objectId={detailId}
      layoutId="app"
      mode="edit"
      context={context}
      defaults={{ owner: context.user._id }}
      onObjectDisappears={(history) => {
        // Should this object disappear (deleted, archived), redirect to it's project
        history.replace(
          `/quick-space/notes/${
            window.location.href.split("/notes/")[1].split("/")[0]
          }`
        );
      }}
    />
  );
};

export default AppQSNote;

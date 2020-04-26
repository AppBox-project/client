import React, { useEffect, useState, memo } from "react";
import { Typography, Grid } from "@material-ui/core";
import { AppContextType } from "../../../Utils/Types";

const AppQSNotesDetail: React.FC<{
  setSelectedMemo;
  context: AppContextType;
  match: { params: { detailId } };
}> = ({
  setSelectedMemo,
  context,
  match: {
    params: { detailId },
  },
}) => {
  // Vars
  const [note, setNote] = useState();

  // Lifecycle
  useEffect(() => {
    setSelectedMemo(detailId);
    const noteRequest = context.getObjects(
      "qs-memo",
      { _id: detailId },
      (response) => {
        if (response.success) {
          setNote(response.data[0]);
        } else {
          console.log(response);
        }
      }
    );

    return () => {
      noteRequest.stop();
      setSelectedMemo(undefined);
    };
  }, [detailId]);

  // UI
  if (!note) return <context.UI.Loading />;
  return (
    <>
      <context.UI.Field
        modelId="qs-memo"
        fieldId="title"
        objectId={detailId}
        mode="free"
        directSave
      />
      <context.UI.Field
        modelId="qs-memo"
        fieldId="body"
        objectId={detailId}
        mode="free"
        directSave
      />
    </>
  );
};

export default AppQSNotesDetail;

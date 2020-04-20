import React, { useEffect, useState, memo } from "react";
import { Typography, Grid } from "@material-ui/core";
import { AppContextType } from "../../../Utils/Types";

const AppQSNotesDetail: React.FC<{
  setSelectedMemo;
  context: AppContextType;
  match: { params: { noteId } };
}> = ({
  setSelectedMemo,
  context,
  match: {
    params: { noteId },
  },
}) => {
  // Vars
  const [note, setNote] = useState();

  // Lifecycle
  useEffect(() => {
    setSelectedMemo(noteId);
    const noteRequest = context.getObjects(
      "qs-memo",
      { _id: noteId },
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
  }, [noteId]);

  // UI
  if (!note) return <context.UI.Loading />;
  return (
    <>
      <context.UI.Forms.TextInput label="Title" value={note.data.title} />
      <context.UI.Field
        modelId="qs-memo"
        fieldId="body"
        objectId={noteId}
        mode="free"
      />
    </>
  );
};

export default AppQSNotesDetail;

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
      setSelectedMemo();
    };
  }, []);

  // UI
  if (!note) return <context.UI.Loading />;
  return (
    <>
      <Typography variant="h6" color="primary" style={{ textAlign: "center" }}>
        {note.data.title}
      </Typography>
      <div style={{ flex: 1 }}>
        <context.UI.Forms.TextInput label="Title" value={note.data.title} />
        <context.UI.Forms.TextInput
          multiline={true}
          label="Note"
          value={note.data.body}
          style={{ flex: 1 }}
        />
      </div>
    </>
  );
};

export default AppQSNotesDetail;

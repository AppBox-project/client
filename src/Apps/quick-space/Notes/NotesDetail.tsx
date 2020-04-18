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
    <div
      style={{
        display: "flex",
        flexFlow: "column",
        height: "calc(100vh - 64px)",
      }}
    >
      <context.UI.Forms.TextInput label="Title" value={note.data.title} />
      <context.UI.Forms.TextInput
        multiline={true}
        label="Note"
        value={note.data.body}
        autoFocus
        style={{ flex: 1, paddingTop: 5 }}
      />
    </div>
  );
};

export default AppQSNotesDetail;

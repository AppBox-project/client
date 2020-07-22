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
  const [note, setNote] = useState<any>();
  const [model, setModel] = useState<any>();

  // Lifecycle
  useEffect(() => {
    // Object
    setSelectedMemo(detailId);
    const noteRequest = context.getObjects(
      "qs-note",
      { _id: detailId },
      (response) => {
        if (response.success) {
          setNote(response.data[0]); // no realtime data for this baby
        } else {
          console.log(response);
        }
      }
    );

    // Model
    const modelRequest = context.getModel("qs-note", (response) => {
      if (response.success) {
        setModel(response.data);
      } else {
        console.log(response);
      }
    });

    return () => {
      noteRequest.stop();
      modelRequest.stop();
      setSelectedMemo(undefined);
    };
  }, [detailId]);

  // UI
  if (!note || !model) return <context.UI.Loading />;
  return (
    <context.UI.Design.Card withBigMargin>
      <context.UI.Field
        modelId="qs-note"
        field={model.fields["title"]}
        fieldId="title"
        object={note}
        mode="free"
        directSave
        directSaveDelay={500}
      />
      <context.UI.Field
        modelId="qs-note"
        fieldId="note"
        field={model.fields["note"]}
        object={note}
        mode="free"
        directSave
        directSaveDelay={1500}
      />
    </context.UI.Design.Card>
  );
};

export default AppQSNotesDetail;

import React, { useEffect, useState } from "react";
import { AppContextType, ListItemType, ObjectType } from "../../../Utils/Types";
import { AppNoteType, AppProjectType } from "../Types";
import AppQSNote from "./Note";

const AppQSNotesDetail: React.FC<{
  context: AppContextType;
  match: { params: { detailId } };
  projects;
}> = ({
  context,
  projects,
  match: {
    params: { detailId },
  },
}) => {
  // Vars
  const [notes, setNotes] = useState<ListItemType[]>();
  const [flatNotes, setFlatNotes] = useState<ObjectType[]>();
  const project: AppProjectType = projects[detailId];

  // Lifecycle
  useEffect(() => {
    context.getObjects("qs-note", { "data.project": detailId }, (response) => {
      if (response.success) {
        setFlatNotes(response.data);
        const newNotes = [];
        response.data.map((o: AppNoteType) => {
          newNotes.push({ label: o.data.title, id: o._id });
        });
        setNotes(newNotes);
      } else {
        console.log(response);
      }
    });
  }, [detailId]);

  // UI
  return (
    <context.UI.Layouts.ListDetailLayout
      list={notes}
      context={context}
      baseUrl={`/quick-space/notes/${detailId}`}
      DetailComponent={AppQSNote}
      detailComponentProps={{ context }}
      title={project.data.name}
      imageField="image"
      objects={flatNotes}
    />
  );
};

export default AppQSNotesDetail;

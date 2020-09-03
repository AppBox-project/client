import React, { useEffect, useState } from "react";
import { AppContextType, ListItemType, ObjectType } from "../../../Utils/Types";
import { AppNoteType, AppProjectType } from "../Types";
import AppQSNote from "./Note";

const AppQSNotesDetail: React.FC<{
  context: AppContextType;
  match: { params: { detailId } };
  projects;
  isMobile: boolean;
}> = ({
  context,
  projects,
  match: {
    params: { detailId },
  },
  isMobile,
}) => {
  // Vars
  const [notes, setNotes] = useState<ListItemType[]>();
  const [flatNotes, setFlatNotes] = useState<ObjectType[]>();
  const [mappedNotes, setMappedNotes] = useState<{}>();
  const project: AppProjectType = projects[detailId];

  // Lifecycle
  useEffect(() => {
    context.getObjects("qs-note", { "data.project": detailId }, (response) => {
      if (response.success) {
        setFlatNotes(response.data);
        const mn = {};
        const newNotes = [];
        response.data.map((o: AppNoteType) => {
          newNotes.push({ label: o.data.title, id: o._id });
          mn[o._id] = o;
        });
        setMappedNotes(mn);
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
      detailComponentProps={{ context, notes: mappedNotes, project }}
      title={project.data.name}
      addFunction={() => {
        context.addObject(
          "qs-note",
          {
            title: "New note",
            project: detailId,
            note: "",
            owner: context.user._id,
          },
          (response) => {
            console.log(response);
          }
        );
      }}
      imageField="image"
      objects={flatNotes}
      style={{ marginBottom: isMobile && 50 }}
    />
  );
};

export default AppQSNotesDetail;

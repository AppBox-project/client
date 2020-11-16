import React, { useEffect, useState } from "react";
import {
  AppContextType,
  ListDetailItemType,
  ModelType,
  ValueListItemType,
} from "../../../Utils/Types";
import { AppNoteType, AppProjectType, AppTagType } from "../Types";
import AppQSNote from "./Note";
import { Divider, ListItem } from "@material-ui/core";

const AppQSNotesDetail: React.FC<{
  context: AppContextType;
  match: { params: { detailId } };
  projects;
  isMobile: boolean;
  model: ModelType;
}> = ({
  context,
  projects,
  match: {
    params: { detailId },
  },
  isMobile,
  model,
}) => {
    // Vars
    const [notes, setNotes] = useState<ListDetailItemType[]>();
    const [filteredNotes, setFilteredNotes] = useState<ListDetailItemType[]>();
    const [flatNotes, setFlatNotes] = useState<AppNoteType[]>();
    const [mappedNotes, setMappedNotes] = useState<{}>();
    const project: AppProjectType = projects[detailId];
    const [tagFilter, setTagFilter] = useState<ValueListItemType[]>([]);
    const [tagOptions, setTagOptions] = useState<ValueListItemType[]>([]);

    // Lifecycle
    useEffect(() => {
      const noteRequest = context.getObjects(
        "qs-note",
        { "data.project": detailId },
        (response) => {
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
        }
      );

      const tagRequest = context.getObjects(
        "qs-tags",
        { "data.show_in_notes": { $ne: false } },
        (response) => {
          if (response.success) {
            const to: ValueListItemType[] = [];
            response.data.map((tag: AppTagType) =>
              to.push({ label: tag.data.name, value: tag._id })
            );
            setTagOptions(to);
          } else {
            console.log();
          }
        }
      );

      return () => {
        noteRequest.stop();
        tagRequest.stop();
      };
    }, [detailId]);

    // Filter lifecycle
    useEffect(() => {
      if ((tagFilter || []).length > 0) {
        const nn: ListDetailItemType[] = [];
        (flatNotes || []).map((note) => {
          let show = false;
          tagFilter.map((tf) => {
            if (note.data.tags.includes(tf.value)) show = true;
          });

          if (show) nn.push({ label: note.data.title, id: note._id });
        });

        setFilteredNotes(nn);
      } else {
        setFilteredNotes(notes);
      }
    }, [tagFilter, notes, flatNotes]);

    // UI
    return (
      <context.UI.Layouts.ListDetailLayout
        list={filteredNotes}
        context={context}
        baseUrl={`/quick-space/notes/${detailId}`}
        DetailComponent={AppQSNote}
        detailComponentProps={{ context, notes: mappedNotes, project }}
        title={project.data.name}
        customNavItems={
          project.data.note_tags_enabled && [
            <ListItem>
              <context.UI.Inputs.Select
                multiple
                label="Tags"
                value={tagFilter}
                onChange={(value) => setTagFilter(value)}
                options={tagOptions}
                style={{ width: "100%" }}
              />
              <Divider />
            </ListItem>,
          ]
        }
        itemSecondary={
          project.data.note_tags_enabled
            ? (item) => (
              <context.UI.FieldDisplay
                objectField={item?.data?.tags}
                modelField={model?.fields?.tags}
                props={{ size: "small" }}
              />
            )
            : undefined
        }
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

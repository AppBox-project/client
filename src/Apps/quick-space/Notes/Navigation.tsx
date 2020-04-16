// disabling flowtype to keep this example super simple
// It matches
/* eslint-disable flowtype/require-valid-file-annotation */

import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { AppContextType } from "../../../Utils/Types";
import { findIndex } from "lodash";

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const AppQSNotesNavigation: React.FC<{
  context: AppContextType;
  projects;
  memos;
}> = ({ context, projects, memos }) => {
  // Vars
  const [items, setItems] = useState([
    { id: "item-1", content: "item 1" },
    { id: "item-2", content: "item 2" },
    { id: "item-3", content: "item 3" },
    { id: "item-4", content: "item 4" },
  ]);
  const [projectId, setProjectId] = useState(projects[0].value);
  const [project, setProject] = useState();
  const [subprojects, setSubprojects] = useState();
  const [subprojectId, setSubprojectId] = useState();
  const [subproject, setSubproject] = useState();

  // Lifecycle
  useEffect(() => {
    const index = findIndex(projects, (o) => {
      return o.value === projectId;
    });
    setProject(projects[index]);
    setSubprojects(projects[index].subprojects);
    if (projects[index].subprojects) {
      setSubprojectId(projects[index].subprojects[0].value);
      setSubproject(
        projects[index].subprojects[projects[index].subprojects[0].value]
      );
    }
  }, [projectId]);

  // Functions
  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const newItems = reorder(
      items,
      result.source.index,
      result.destination.index
    );

    // @ts-ignore
    setItems(newItems);
  };

  // UI

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ margin: 15 }}>
        <context.UI.Forms.SelectInput
          options={projects}
          value={projectId}
          onChange={(value) => {
            setProjectId(value);
          }}
        />
        {subprojects && (
          <context.UI.Forms.SelectInput
            options={subprojects}
            value={subprojectId}
            onChange={(value) => {
              setSubprojectId(value);
            }}
          />
        )}
      </div>
    </DragDropContext>
  );
};
/*      <Droppable droppableId="droppable">
        {(droppableProvided, droppableSnapshot) => (
          <div
            ref={droppableProvided.innerRef}
            style={{
              transition: "all 1s",
              padding: grid,
            }}
          >
            {project.subProjects.map((item, index) => {
              return (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(draggableProvided, draggableSnapshot) => (
                    <div
                      ref={draggableProvided.innerRef}
                      {...draggableProvided.draggableProps}
                      {...draggableProvided.dragHandleProps}
                      style={{
                        // some basic styles to make the items look a bit nicer
                        userSelect: "none",
                        padding: grid * 2,
                        margin: `0 0 ${grid}px 0`,
                        transition: "all 1s",
                        // change background colour if dragging
                        background: draggableSnapshot.isDragging
                          ? "#ffffff"
                          : "#eeeeee",

                        // styles we need to apply on draggables
                        ...draggableProvided.draggableProps.style,
                      }}
                    >
                      {item.label}
                    </div>
                  )}
                </Draggable>
              );
            })}
            {droppableProvided.placeholder}
          </div>
        )}
      </Droppable>
 */
export default AppQSNotesNavigation;

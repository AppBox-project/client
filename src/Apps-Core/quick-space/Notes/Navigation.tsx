import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { AppContextType } from "../../../Utils/Types";
import { find, filter } from "lodash";
import {
  Grid,
  ListItem,
  ListItemText,
  List,
  ListSubheader,
  Typography,
  ListItemIcon,
  Button,
  Icon,
} from "@material-ui/core";
import { FaGripLines, FaStickyNote, FaPlus } from "react-icons/fa";
import { useHistory } from "react-router-dom";

const grid = 8;

const AppQSNotesNavigation: React.FC<{
  context: AppContextType;
  projects;
  memos;
  flatProjects;
  selectedMemo: string;
}> = ({ context, projects, memos, flatProjects, selectedMemo }) => {
  // Vars
  const [projectOverview, setProjectOverview] = useState();
  const [selectedProject, setSelectedProject] = useState();
  const [project, setProject] = useState();
  const [activeMemos, setActiveMemos] = useState();

  // Lifecycle
  useEffect(() => {
    setProjectOverview(projects);
  }, [projects]);
  useEffect(() => {
    setProject(
      find(flatProjects, (o) => {
        return o._id == selectedProject;
      })
    );
    setActiveMemos(
      filter(memos, (o) => {
        return o.data.project === selectedProject;
      })
    );
  }, [selectedProject, memos]);

  // Functions
  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    // Remove source
    const removed = find(projectOverview, (o) => {
      return o.value === result.source.droppableId;
    }).subprojects.splice(result.source.index, 1)[0];

    // Add to destination

    find(projectOverview, (o) => {
      return o.value === result.destination.droppableId;
    }).subprojects.splice(result.destination.index, 0, removed);
  };

  // UI
  return (
    <Grid container style={{ height: "100%" }}>
      <Grid item xs={6} style={{ borderRight: "1px solid #eeeeee" }}>
        <Typography
          variant="h6"
          color="primary"
          style={{ textAlign: "center" }}
        >
          Projects
        </Typography>
        <DragDropContext onDragEnd={onDragEnd}>
          <List>
            {projects.map((project) => {
              return (
                <div key={project.value}>
                  <ListSubheader
                    onClick={() => {
                      setSelectedProject(project.value);
                    }}
                  >
                    {project.label}
                  </ListSubheader>
                  <Droppable droppableId={project.value}>
                    {(droppableProvided, droppableSnapshot) => (
                      <div
                        ref={droppableProvided.innerRef}
                        style={{
                          transition: "all 1s",
                          padding: grid,
                        }}
                      >
                        {project.subprojects.map((subproject, index) => {
                          return (
                            <Draggable
                              key={subproject.value}
                              draggableId={subproject.value}
                              index={index}
                            >
                              {(draggableProvided, draggableSnapshot) => (
                                <ListItem
                                  selected={
                                    subproject.value === selectedProject
                                  }
                                  ref={draggableProvided.innerRef}
                                  {...draggableProvided.draggableProps}
                                  {...draggableProvided.dragHandleProps}
                                  button
                                  onClick={() => {
                                    setSelectedProject(subproject.value);
                                  }}
                                >
                                  <ListItemIcon>
                                    <FaGripLines />
                                  </ListItemIcon>
                                  <ListItemText>
                                    {subproject.label}
                                  </ListItemText>
                                </ListItem>
                              )}
                            </Draggable>
                          );
                        })}
                        {droppableProvided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </List>
        </DragDropContext>
      </Grid>
      <Grid item xs={6} style={{ borderRight: "1px solid #eeeeee" }}>
        {project && (
          <>
            <Typography
              variant="h6"
              color="primary"
              style={{ textAlign: "center" }}
            >
              {project.data.name}
            </Typography>
            <context.UI.Layouts.SortableList
              listItems={activeMemos}
              listTextPath="data.title"
              baseUrl="/quick-space/notes"
              linkToPath="_id"
              button
              onAdd={() => {
                context.addObject(
                  "qs-note",
                  {
                    title: "Fresh note",
                    project: selectedProject,
                  },
                  () => {}
                );
              }}
            />
          </>
        )}
      </Grid>
    </Grid>
  );
};

export default AppQSNotesNavigation;

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
  const history = useHistory();

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
  }, [selectedProject]);
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
    console.log(result.destination.index);

    find(projectOverview, (o) => {
      return o.value === result.destination.droppableId;
    }).subprojects.splice(result.destination.index, 0, removed);
  };

  const activeMemos = project
    ? filter(memos, (o) => {
        return o.data.project === project._id;
      })
    : null;

  // UI
  return (
    <Grid container style={{ height: "calc(100vh - 64px)" }}>
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
                <>
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
                </>
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
            <DragDropContext
              onDragEnd={(swap) => {
                const result = activeMemos;
                const [removed] = result.splice(swap.source.index, 1);
                result.splice(swap.destination.index, 0, removed);
                console.log(result);
              }}
            >
              <List>
                <Droppable droppableId="memos">
                  {(droppableProvided, droppableSnapshot) => (
                    <div
                      ref={droppableProvided.innerRef}
                      style={{
                        transition: "all 1s",
                      }}
                    >
                      {activeMemos.map((memo, index) => {
                        return (
                          <Draggable
                            key={memo._id}
                            draggableId={memo._id}
                            index={index}
                          >
                            {(draggableProvided, draggableSnapshot) => (
                              <ListItem
                                onClick={() => {
                                  history.push(
                                    `/quick-space/notes/${memo._id}`
                                  );
                                }}
                                selected={selectedMemo == memo._id}
                                ref={draggableProvided.innerRef}
                                {...draggableProvided.draggableProps}
                                {...draggableProvided.dragHandleProps}
                                button
                              >
                                <ListItemIcon>
                                  <FaStickyNote />
                                </ListItemIcon>
                                <ListItemText>{memo.data.title}</ListItemText>
                              </ListItem>
                            )}
                          </Draggable>
                        );
                      })}
                      {droppableProvided.placeholder}
                    </div>
                  )}
                </Droppable>
                <ListItem
                  button
                  onClick={() => {
                    context.addObject("qs-memo", {
                      title: "Fresh note",
                      project: selectedProject,
                    });
                  }}
                >
                  <ListItemIcon>
                    <FaPlus />
                  </ListItemIcon>
                </ListItem>
              </List>
            </DragDropContext>
          </>
        )}
      </Grid>
    </Grid>
  );
};

export default AppQSNotesNavigation;

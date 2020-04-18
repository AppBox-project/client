import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { AppContextType } from "../../../Utils/Types";
import { find, findIndex } from "lodash";
import {
  Grid,
  ListItem,
  ListItemText,
  List,
  ListSubheader,
  Typography,
  ListItemIcon,
} from "@material-ui/core";
import { FaList, FaGripHorizontal } from "react-icons/fa";

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
  flatProjects;
}> = ({ context, projects, memos, flatProjects }) => {
  // Vars
  const [projectOverview, setProjectOverview] = useState();
  const [selectedProject, setSelectedProject] = useState();
  const [project, setProject] = useState();

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

  // UI
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Grid container>
        <Grid item xs={6}>
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
                                  ref={draggableProvided.innerRef}
                                  {...draggableProvided.draggableProps}
                                  {...draggableProvided.dragHandleProps}
                                  button
                                  onClick={() => {
                                    setSelectedProject(subproject.value);
                                  }}
                                >
                                  <ListItemIcon>
                                    <FaGripHorizontal />
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
        </Grid>
        <Grid item xs={6}>
          {project && (
            <Typography
              variant="h6"
              color="primary"
              style={{ textAlign: "center" }}
            >
              {project.data.name}
            </Typography>
          )}
        </Grid>
      </Grid>
    </DragDropContext>
  );
};

/*<Droppable droppableId="droppable">
              {(droppableProvided, droppableSnapshot) => (
                <div
                  ref={droppableProvided.innerRef}
                  style={{
                    transition: "all 1s",
                    padding: grid,
                  }}
                >
                  {subprojects.map((subproject, index) => {
                    return (
                      <Draggable
                        key={subproject.value}
                        draggableId={subproject.value}
                        index={index}
                      >
                        {(draggableProvided, draggableSnapshot) => (
                          <ListItem
                            ref={draggableProvided.innerRef}
                            {...draggableProvided.draggableProps}
                            {...draggableProvided.dragHandleProps}
                            button
                            onClick={() => {
                              setSubprojectId(subproject.value);
                            }}
                          >
                            <ListItemText>{subproject.label}</ListItemText>
                          </ListItem>
                        )}
                      </Draggable>
                    );
                  })}
                  {droppableProvided.placeholder}
                </div>
              )}
            </Droppable> */

export default AppQSNotesNavigation;

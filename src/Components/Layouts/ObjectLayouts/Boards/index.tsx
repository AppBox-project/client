import React, { useState, useEffect } from "react";
import { AppContextType, ModelType } from "../../../../Utils/Types";
import { Paper, Typography } from "@material-ui/core";
import {
  DragDropContext,
  Droppable,
  DropResult,
  DraggableLocation,
  Draggable,
  DroppableProvided,
} from "react-beautiful-dnd";
import { map, filter } from "lodash";
import Column from "./Column";

const BoardLayout: React.FC<{
  context: AppContextType;
  objects;
  model: ModelType;
  boardField: string;
}> = ({ context, objects, model, boardField }) => {
  // Vars
  const [newObjects, setNewObjects] = useState(objects);

  // Lifecycle
  useEffect(() => {
    setNewObjects(objects);
  }, [objects]);

  const onDragEnd = (result: DropResult) => {
    console.log(result);
  };

  // UI
  return (
    <div style={{ width: "max-content", height: "100%" }}>
      <context.UI.Animations.AnimationContainer>
        <DragDropContext onDragEnd={onDragEnd}>
          {map(model.fields[boardField].typeArgs.options, (option, index) => {
            return (
              <Droppable droppableId={option.key}>
                {(droppableProvided, droppableSnapshot) => (
                  <div
                    ref={droppableProvided.innerRef}
                    style={{ width: 250, display: "inline-block" }}
                  >
                    <context.UI.Animations.AnimationItem>
                      <Paper
                        className="paper"
                        style={{
                          transition: "all 1s",
                          margin: 15,
                        }}
                      >
                        <Typography variant="h6">{option.label}</Typography>
                        {map(
                          filter(objects, (o) => {
                            return o.data[boardField] === option.key;
                          }),
                          (todo, index) => {
                            return (
                              <Draggable
                                key={todo._id}
                                draggableId={todo._id}
                                index={index}
                              >
                                {(draggableProvided, draggableSnapshot) => (
                                  <div
                                    ref={draggableProvided.innerRef}
                                    {...draggableProvided.draggableProps}
                                    {...draggableProvided.dragHandleProps}
                                  >
                                    {todo.data[model.primary]}
                                  </div>
                                )}
                              </Draggable>
                            );
                          }
                        )}
                        {droppableProvided.placeholder}
                      </Paper>
                    </context.UI.Animations.AnimationItem>
                  </div>
                )}
              </Droppable>
            );
          })}
        </DragDropContext>
      </context.UI.Animations.AnimationContainer>
    </div>
  );
};
export default BoardLayout;

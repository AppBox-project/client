import React, { useState, useEffect } from "react";
import { AppContextType, ModelType } from "../../../../Utils/Types";
import { Typography, Divider } from "@material-ui/core";
import {
  DragDropContext,
  Droppable,
  DropResult,
  Draggable,
} from "react-beautiful-dnd";
import { map, filter, findIndex } from "lodash";
import styles from "./styles.module.scss";

const BoardLayout: React.FC<{
  context: AppContextType;
  objects;
  model: ModelType;
  boardField: string;
  onItemClick?: (item) => void;
  customItem?: (listItem) => JSX.Element;
}> = ({ context, objects, model, boardField, onItemClick, customItem }) => {
  // Vars
  const [newObjects, setNewObjects] = useState(objects);
  const noGroup = filter(newObjects, (o) => {
    return !o.data[boardField];
  });
  // Lifecycle
  useEffect(() => {
    setNewObjects(objects);
  }, [objects]);

  const onDragEnd = (result: DropResult) => {
    if (result.destination.droppableId !== result.source.droppableId) {
      // Update preview for a smoother experience than waiting for DB
      const index = findIndex(newObjects, (o) => {
        return o._id === result.draggableId;
      });
      newObjects[index].data[boardField] = result.destination.droppableId;
      setNewObjects(newObjects);

      // Save actual change
      context.updateObject(
        model.key,
        { [boardField]: result.destination.droppableId },
        result.draggableId
      );
    }
  };

  // UI
  return (
    <div
      style={{
        width: "max-content",
        height: "100%",
      }}
    >
      <context.UI.Animations.AnimationContainer>
        <DragDropContext onDragEnd={onDragEnd}>
          <div style={{ display: "flex", flexDirection: "row" }}>
            {noGroup.length > 0 && (
              <Droppable droppableId="empty">
                {(droppableProvided, droppableSnapshot) => (
                  <div
                    ref={droppableProvided.innerRef}
                    style={{ flex: 1, minWidth: 250 }}
                  >
                    <context.UI.Animations.AnimationItem>
                      <div className={styles.column}>
                        <Typography
                          variant="h6"
                          color="primary"
                          style={{ textAlign: "center" }}
                        >
                          No {boardField}
                        </Typography>
                        <Divider style={{ margin: "8px 0 8px 0" }} />
                        {map(noGroup, (todo, index) => {
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
                                  <div className={styles.draggable}>
                                    {customItem ? (
                                      customItem(todo)
                                    ) : (
                                      <Typography variant="body1">
                                        {todo.data[model.primary]}
                                      </Typography>
                                    )}
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                        {droppableProvided.placeholder}
                      </div>
                    </context.UI.Animations.AnimationItem>
                  </div>
                )}
              </Droppable>
            )}
            {map(model.fields[boardField].typeArgs.options, (option, index) => {
              return (
                <Droppable droppableId={option.key} key={option.key}>
                  {(droppableProvided, droppableSnapshot) => {
                    return (
                      <div
                        ref={droppableProvided.innerRef}
                        style={{ flex: 1, minWidth: 250 }}
                      >
                        <context.UI.Animations.AnimationItem>
                          <div className={styles.column}>
                            <Typography
                              variant="h6"
                              color="primary"
                              style={{ textAlign: "center" }}
                            >
                              {option.label}
                            </Typography>
                            <Divider style={{ margin: "8px 0 8px 0" }} />
                            {map(
                              filter(newObjects, (o) => {
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
                                        <div
                                          className={styles.draggable}
                                          onClick={() => {
                                            if (onItemClick) onItemClick(todo);
                                          }}
                                        >
                                          {customItem ? (
                                            customItem(todo)
                                          ) : (
                                            <Typography variant="body1">
                                              {todo.data[model.primary]}
                                            </Typography>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </Draggable>
                                );
                              }
                            )}
                            {droppableProvided.placeholder}
                          </div>
                        </context.UI.Animations.AnimationItem>
                      </div>
                    );
                  }}
                </Droppable>
              );
            })}
          </div>
        </DragDropContext>
      </context.UI.Animations.AnimationContainer>
    </div>
  );
};
export default BoardLayout;

import React, { useState, useEffect } from "react";
import { List, ListItem, ListItemText, ListItemIcon } from "@material-ui/core";
import { get } from "lodash";
import { useHistory } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FaPlus } from "react-icons/fa";

const SortableList: React.FC<{
  listItems: [];
  listTextPath: string;
  ListIcon?: React.FC;
  baseUrl: string;
  linkToPath: string;
  button: true;
  onAdd: () => void;
}> = ({
  listItems,
  listTextPath,
  baseUrl,
  linkToPath,
  button,
  ListIcon,
  onAdd,
}) => {
  // Vars
  const history = useHistory();
  const [items, setItems] = useState([]);

  // Lifecycle
  useEffect(() => {
    setItems(listItems);
  }, [listItems]);

  // UI
  return (
    <DragDropContext
      onDragEnd={(swap) => {
        const result = listItems;
        const [removed] = result.splice(swap.source.index, 1);
        result.splice(swap.destination.index, 0, removed);
        setItems(result);
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
              {listItems.map((listItem, index) => {
                return (
                  <Draggable
                    key={
                      //@ts-ignore
                      listItem._id
                    }
                    draggableId={
                      //@ts-ignore
                      listItem._id
                    }
                    index={index}
                  >
                    {(draggableProvided, draggableSnapshot) => (
                      <ListItem
                        button={button}
                        onClick={() => {
                          history.push(
                            `${baseUrl}/${get(listItem, linkToPath)}`
                          );
                        }}
                        ref={draggableProvided.innerRef}
                        {...draggableProvided.draggableProps}
                        {...draggableProvided.dragHandleProps}
                      >
                        <ListItemIcon>
                          <ListIcon />
                        </ListItemIcon>
                        <ListItemText>
                          {get(listItem, listTextPath)}
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
        {onAdd && (
          <ListItem button onClick={onAdd}>
            <ListItemIcon>
              <FaPlus />
            </ListItemIcon>
          </ListItem>
        )}
      </List>
    </DragDropContext>
  );
};

export default SortableList;

import React, { useState, useEffect } from "react";
import { List, ListItem, ListItemText, ListItemIcon } from "@material-ui/core";
import { get } from "lodash";
import { useHistory } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FaPlus } from "react-icons/fa";
import Server from "../../../Utils/Server";
import uniqid from "uniqid";

const SortableList: React.FC<{
  listItems: [];
  listTextPath: string;
  listSubTextPath?: string;
  ListIcon?: React.FC;
  listAction?: (id: string, object) => JSX.Element;
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
  listAction,
  listSubTextPath,
  onAdd,
}) => {
  // Vars
  const history = useHistory();
  const [items, setItems] = useState([]);

  // Lifecycle
  useEffect(() => {
    setItems(listItems);
  }, [listItems]);
  console.log(listSubTextPath);

  // UI
  return (
    <DragDropContext
      onDragEnd={(swap) => {
        const result = listItems;
        const [removed] = result.splice(swap.source.index, 1);
        result.splice(swap.destination.index, 0, removed);
        setItems(result);
        const changes = {};
        for (let x = 0; x < result.length; x++) {
          //@ts-ignore
          changes[result[x]._id] = { order: x };
        }

        // Batch update the order for all the items
        const requestId = uniqid();
        Server.emit("updateMany", { changes, requestId });
        Server.on(`receive-${requestId}`, (response) => {
          console.log(response);
        });
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
                        {(ListIcon || listAction) && (
                          <ListItemIcon>
                            {listAction ? (
                              listAction(get(listItem, linkToPath), listItem)
                            ) : (
                              <ListIcon />
                            )}
                          </ListItemIcon>
                        )}
                        <ListItemText
                          primary={get(listItem, listTextPath)}
                          secondary={get(listItem, listSubTextPath)}
                        />
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

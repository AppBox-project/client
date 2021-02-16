import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

interface ItemType {
  label: string;
  id: string;
}

const SortableList: React.FC<{
  items: ItemType[];
  onChange: (items: ItemType[]) => void;
  renderItem?: (item: ItemType, index: number) => JSX.Element;
}> = ({ items, onChange, renderItem }) => {
  // Vars
  const [newItems, setNewItems] = useState<ItemType[]>([]);

  // Lifecycle
  useEffect(() => {
    setNewItems(items);
  }, [items]);

  // UI
  return (
    <DragDropContext
      onDragEnd={(result) => {
        // dropped outside the list
        if (!result.destination) {
          return;
        }

        const items: ItemType[] = reorder(
          newItems,
          result.source.index,
          result.destination.index
        );

        setNewItems(items);
        onChange(items);
      }}
    >
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {newItems.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    {renderItem ? renderItem(item, index) : item.label}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default SortableList;

const reorder = (list, startIndex, endIndex) => {
  const result: ItemType[] = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

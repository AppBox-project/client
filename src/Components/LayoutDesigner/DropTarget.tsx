import React, { useState } from "react";
import { useDrop } from "react-dnd";
import styles from "./styles.module.scss";
import { Typography } from "@material-ui/core";
import { LayoutDesignerItem } from "../../Utils/Types";

export interface DustbinState {
  hasDropped: boolean;
  hasDroppedOnChild: boolean;
}

const DropTarget: React.FC<{
  children?;
  layoutItem?: LayoutDesignerItem;
  root?: true; componentList?,
  onChange: (response) => void;
}> = ({ layoutItem, children, root, onChange, componentList }) => {
  const [{ isOver, isOverCurrent }, drop] = useDrop({
    accept: "box",
    drop(item, monitor) {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        return;
      }
      onChange(item);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true }),
    }),
  });

  let className = styles.dropTarget;
  if (isOverCurrent) className += " " + styles.dropTargetActive;

  return (
    <div className={!root && styles.componentWrapper}>
      <Typography variant="h6" style={{ textAlign: "center" }}>
        {root ? "Layout" : componentList[layoutItem.type].label}
      </Typography>
      {!root ? componentList[layoutItem.type].droppable && <div ref={drop} className={className}>
        {children ? (
          <>{children}</>
        ) : (
            <Typography variant="caption">Drop items here</Typography>
          )}
      </div> : <div ref={drop} className={className}>
          {children ? (
            <>{children}</>
          ) : (
              <Typography variant="caption">Drop items here</Typography>
            )}
        </div>}
    </div>
  );
};

export default DropTarget;

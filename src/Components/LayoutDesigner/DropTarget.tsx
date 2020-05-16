import React, { useState } from "react";
import { useDrop } from "react-dnd";
import styles from "./styles.module.scss";
import { Typography, IconButton } from "@material-ui/core";
import { LayoutDesignerItem } from "../../Utils/Types";
import { FaCog } from "react-icons/fa";

export interface DustbinState {
  hasDropped: boolean;
  hasDroppedOnChild: boolean;
}

const DropTarget: React.FC<{
  children?;
  layoutItem?: LayoutDesignerItem;
  root?: true;
  componentList?;
  onChange: (response) => void;
  onChangeProps?: (result) => void;
  onDelete?;
  Wrapper;
}> = ({
  layoutItem,
  children,
  root,
  onChange,
  componentList,
  onChangeProps,
  onDelete,
  Wrapper,
}) => {
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

  if (root)
    return (
      <Wrapper {...layoutItem}>
        <div ref={drop} className={className}>
          {children ? (
            <>{children}</>
          ) : (
            <Typography variant="caption">Drop items here</Typography>
          )}
        </div>
      </Wrapper>
    );
  return (
    <Wrapper
      className={
        componentList[layoutItem.type].droppable
          ? styles.componentWrapper
          : styles.componentWrapperSmall
      }
      {...layoutItem}
    >
      <Typography
        variant={componentList[layoutItem.type].droppable ? "h6" : "body1"}
        style={{ textAlign: "center", cursor: "default", width: "100%" }}
      >
        {componentList[layoutItem.type].popup && (
          <IconButton
            onClick={() => {
              componentList[layoutItem.type].popup(
                componentList[layoutItem.type],
                layoutItem,
                (result) => {
                  onChangeProps(result);
                },
                onDelete
              );
            }}
          >
            <FaCog style={{ height: 18, width: 18 }} />
          </IconButton>
        )}
        {componentList[layoutItem.type].label}
        {componentList[layoutItem.type].dynamicLabel &&
          ": " + layoutItem[componentList[layoutItem.type].dynamicLabel]}
      </Typography>
      {componentList[layoutItem.type].droppable && (
        <>
          <Typography
            variant="caption"
            ref={drop}
            style={{ width: "100%", textAlign: "center" }}
          >
            Drop items here
          </Typography>
          <Wrapper className={className}>{children && children}</Wrapper>
        </>
      )}
    </Wrapper>
  );
};

export default DropTarget;

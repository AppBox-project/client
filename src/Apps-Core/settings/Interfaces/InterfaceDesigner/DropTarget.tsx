import React from "react";
import { useGlobal } from "reactn";
import { useDrop } from "react-dnd";
import styles from "./styles.module.scss";
import { Typography, IconButton } from "@material-ui/core";
import { FaCog } from "react-icons/fa";
import { useDrag } from "react-dnd";
import { LayoutDesignerItem } from "../../../../Utils/Types";

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
  const [gTheme] = useGlobal<any>("theme");

  const [, drag] = useDrag({
    item: { type: "box", id: layoutItem?.type, migration: layoutItem },
  });

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
      <Wrapper {...layoutItem} ref={drag}>
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
      ref={drag}
      className={
        componentList[layoutItem.type].droppable
          ? `${styles.componentWrapper} ${className}`
          : styles.componentWrapperSmall
      }
      {...layoutItem}
    >
      <div ref={drag} style={{ display: "flex", width: "100%" }}>
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
            <FaCog
              style={{
                float: "left",
                color: componentList[layoutItem.type].droppable
                  ? gTheme.palette.type === "light"
                    ? "#485263"
                    : "white"
                  : "white",
                height: 18,
                width: 18,
              }}
            />
          </IconButton>
        )}
        <Typography
          variant={componentList[layoutItem.type].droppable ? "h6" : "body1"}
          style={{
            textAlign: "center",
            cursor: "default",
            width: "100%",
            flex: 1,
            lineHeight: "42px",
            position: "relative",
            left: -18,
          }}
          ref={drop}
        >
          {componentList[layoutItem.type].label}
          {componentList[layoutItem.type].dynamicLabel &&
            ": " + layoutItem[componentList[layoutItem.type].dynamicLabel]}
        </Typography>
      </div>
      {componentList[layoutItem.type].droppable && (
        <>
          <Typography
            variant="caption"
            style={{ width: "100%", textAlign: "center" }}
          >
            Drop items here
          </Typography>
          {children && children}
        </>
      )}
    </Wrapper>
  );
};

export default DropTarget;

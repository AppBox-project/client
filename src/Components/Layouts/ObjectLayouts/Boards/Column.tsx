// @flow
import React, { Component } from "react";
import {
  Draggable,
  Droppable,
  DraggableProvided,
  DraggableStateSnapshot,
  DroppableProvided,
  DroppableStateSnapshot,
} from "react-beautiful-dnd";
import { Typography, Paper } from "@material-ui/core";

const Column: React.FC<{ title; index }> = ({ title, index }) => {
  return (
    <Draggable draggableId={title.label} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <div>test</div>
      )}
    </Draggable>
  );
};

export default Column;

import React, { useState } from "react";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  ListItemSecondaryAction,
  IconButton,
  Collapse,
  TextField,
} from "@material-ui/core";
import { GoTasklist } from "react-icons/go";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import { filter } from "lodash";
import { FaStickyNote } from "react-icons/fa";
import { AppContextType, ModelType } from "../../../Utils/Types";
import { useHistory } from "react-router-dom";
import { AppTodoType } from "../Types";

const AppQSActionTodoDetailTodo: React.FC<{
  todo: AppTodoType;
  context: AppContextType;
  model: ModelType;
  isMobile: boolean;
}> = ({ todo, context, model, isMobile }) => {
  // Vars

  // Lifecycle

  // UI
  return (
    <ListItem
      button
      onClick={() => {
        context.setDialog({
          display: true,
          size: "md",
          title: todo.data.action,
          content: (
            <context.UI.Layouts.Object.ObjectLayout
              model={model}
              layoutId="popup"
              popup
              context={context}
              objectId={todo._id}
            />
          ),
        });
      }}
    >
      <ListItemText
        primary={todo.data.action}
        secondary={todo.data.description}
      />
    </ListItem>
  );
};

export default AppQSActionTodoDetailTodo;

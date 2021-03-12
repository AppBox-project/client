import React, { useState } from "react";
import { CustomLayoutElementType } from "../../../Utils/Types";
import x from "uniqid";

const AppQSAddSubTodo: React.FC<CustomLayoutElementType> = ({
  context,
  object,
}) => {
  const [newTodo, setNewTodo] = useState<string>("");

  return (
    <context.UI.Inputs.TextInput
      style={{ margin: 15 }}
      label="Add subtodo"
      value={newTodo}
      onChange={(value: string) => setNewTodo(value)}
      onEscape={() => setNewTodo("")}
      onEnter={() => {
        setNewTodo("");
        context.addObject(
          "qs-todo",
          {
            action: newTodo,
            project: object.data.project,
            owner: context.user._id,
            belongs_to: object._id,
          },
          () => {}
        );
      }}
    />
  );
};

export default AppQSAddSubTodo;

import React, { useState, useEffect } from "react";
import { ModelType, ConditionType } from "../../Utils/Types";
import { ListItem, List, ListItemText } from "@material-ui/core";

const ConditionDesigner: React.FC<{
  model: ModelType;
  value: ConditionType[];
  onChange: (value: ConditionType[]) => void;
}> = ({ model, onChange, value }) => {
  // UI
  return (
    <List>
      {value.length === 0 && (
        <ListItem>
          <ListItemText>No conditions found</ListItemText>
        </ListItem>
      )}
      <ListItem button onClick={() => {}}>
        <ListItemText>Add condition</ListItemText>
      </ListItem>
    </List>
  );
};

export default ConditionDesigner;

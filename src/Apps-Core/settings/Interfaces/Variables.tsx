import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import React from "react";
import { FaPlus } from "react-icons/fa";
import { AppContextType } from "../../../Utils/Types";
import { InterfaceType } from "../Types";
import { map } from "lodash";

const AppSettingsInterfaceVariables: React.FC<{
  newInterface: InterfaceType;
  context: AppContextType;
  setNewInterface: (newInterface: InterfaceType) => void;
}> = ({ newInterface, context, setNewInterface }) => {
  return (
    <List>
      {map(newInterface.data.data.variables, (value, key) => (
        <ListItem
          key={key}
          button
          onClick={() => {
            context.setDialog({
              display: true,
              title: "Update variable",
              form: [
                { label: "Key", key: "key", type: "text", value: key },
                {
                  label: "Label",
                  key: "label",
                  type: "text",
                  value: value.label,
                },
                {
                  label: "Type",
                  key: "type",
                  type: "dropdown",
                  value: value.type,
                  dropdownOptions: [{ label: "Text", value: "text" }],
                },
              ],
              buttons: [
                {
                  label: "Save",
                  onClick: (form) => {
                    const newInt = newInterface;
                    delete newInterface.data.data.variables[key];
                    newInterface.data.data.variables[form.key] = {
                      label: form.label,
                      type: form.type,
                    };
                    setNewInterface(newInt);
                  },
                },
              ],
            });
          }}
        >
          <ListItemText>{value.label}</ListItemText>
        </ListItem>
      ))}
      <ListItem
        button
        onClick={() => {
          setNewInterface({
            ...newInterface,
            data: {
              ...newInterface.data,
              data: {
                ...newInterface.data.data,
                variables: {
                  ...newInterface.data.data.variables,
                  new: { label: "New variable", type: "text" },
                },
              },
            },
          });
        }}
      >
        <ListItemIcon style={{ minWidth: 24 }}>
          <FaPlus />
        </ListItemIcon>
        <ListItemText>Add</ListItemText>
      </ListItem>
    </List>
  );
};

export default AppSettingsInterfaceVariables;

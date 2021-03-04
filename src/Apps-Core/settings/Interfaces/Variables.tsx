import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import React from "react";
import {
  FaAlignJustify,
  FaList,
  FaPlus,
  FaSortNumericDown,
  FaToggleOn,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import {
  AppContextType,
  InterfaceType,
  ModelType,
  ValueListItemType,
} from "../../../Utils/Types";
import { map } from "lodash";

const AppSettingsInterfaceVariables: React.FC<{
  newInterface: InterfaceType;
  context: AppContextType;
  setNewInterface: (newInterface: InterfaceType) => void;
  models: ModelType[];
  modelList: ValueListItemType[];
}> = ({ newInterface, context, setNewInterface, modelList }) => {
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
                  label: "Description (optional)",
                  key: "description",
                  type: "text",
                  value: value.description,
                },
                {
                  label: "Type",
                  key: "type",
                  type: "dropdown",
                  value: value.type,
                  dropdownOptions: [
                    { label: "Text", value: "text" },
                    { label: "Number", value: "number" },
                    { label: "Boolean", value: "boolean" },
                    { label: "Options", value: "options" },
                    { label: "Object", value: "object" },
                    { label: "Objects", value: "objects" },
                  ],
                },
                {
                  label: "Model",
                  key: "model",
                  type: "dropdown",
                  value: value.model,
                  dropdownOptions: modelList,
                  onlyDisplayWhen: { type: "object" },
                },
                {
                  label: "Model",
                  key: "model",
                  type: "dropdown",
                  value: value.model,
                  dropdownOptions: modelList,
                  onlyDisplayWhen: { type: "objects" },
                },
                {
                  label: "Default value",
                  key: "default",
                  type: "boolean",
                  value: value.default,
                  onlyDisplayWhen: { type: "boolean" },
                },
                {
                  label: "Options (comma seperated)",
                  key: "options",
                  type: "text",
                  value: value.options,
                  onlyDisplayWhen: { type: "options" },
                },
                {
                  label: "Default value",
                  key: "default",
                  type: "text",
                  value: value.default,
                  onlyDisplayWhen: { type: "options" },
                },
                {
                  label: "Default value",
                  key: "default",
                  type: "number",
                  value: value.default,
                  onlyDisplayWhen: { type: "number" },
                },
                {
                  key: "input_var",
                  label: "Input variable",
                  value: value.input_var,
                  type: "boolean",
                  onlyDisplayWhen: { type: "object" },
                },
                {
                  key: "input_var",
                  label: "Input variable",
                  value: value.input_var,
                  type: "boolean",
                  onlyDisplayWhen: { type: "text" },
                },
                {
                  key: "input_required",
                  label: "Required for input",
                  value: value.input_required,
                  type: "boolean",
                  onlyDisplayWhen: { input_var: true },
                },
              ],
              buttons: [
                {
                  label: "Save",
                  onClick: (form) => {
                    const newInt = newInterface;
                    delete newInterface.data.data.variables[key];
                    newInterface.data.data.variables[form.key] = form;
                    setNewInterface(newInt);
                  },
                },
              ],
            });
          }}
        >
          <ListItemIcon style={{ minWidth: 32 }}>
            {value.type === "objects" && <FaUsers />}
            {value.type === "object" && <FaUser />}
            {value.type === "text" && <FaAlignJustify />}
            {value.type === "boolean" && <FaToggleOn />}
            {value.type === "options" && <FaList />}
            {value.type === "number" && <FaSortNumericDown />}
          </ListItemIcon>
          <ListItemText primary={value.label} secondary={value.description} />
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
